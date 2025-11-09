// src/hooks/useNotificationSSE.ts
'use client';

import { tokenStore } from '@/lib/tokenStore';
import type { NotificationResponseDTO } from '@/types/notification';
import { useEffect, useRef, useState } from 'react';

type NotificationHandler = (notification: NotificationResponseDTO) => void;

type SSEController = AbortController;

export function useNotificationSSE(onNotification?: NotificationHandler) {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<SSEController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3초

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      console.log('🔔 SSE: 토큰이 없어 연결하지 않습니다');
      return;
    }

    if (!onNotification) {
      console.log('🔔 SSE: 알림 핸들러가 없어 연결하지 않습니다');
      return;
    }

    console.log('🔔 SSE: 연결 시도 중...');
    // EventSource는 헤더에 Authorization을 직접 넣을 수 없으므로
    // fetch를 사용해서 스트림을 읽는 방식으로 변경
    const BASE = '/api';
    const url = `${BASE}/v1/notifications/subscribe`;

    function connect() {
      if (eventSourceRef.current) {
        // EventSource가 아닌 경우도 있으므로 체크
        if ('close' in eventSourceRef.current) {
          (eventSourceRef.current as EventSource).close();
        }
        eventSourceRef.current = null;
      }

      // fetch를 사용하여 SSE 스트림 읽기
      const abortController = new AbortController();
      
      fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${token}`,
        },
        signal: abortController.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error(`🔔 SSE 연결 실패: ${response.status}`);
            throw new Error(`SSE 연결 실패: ${response.status}`);
          }

          console.log('🔔 SSE: 연결 성공, 스트림 읽기 시작');
          console.log('🔔 SSE: Response headers:', Object.fromEntries(response.headers.entries()));
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('스트림 리더를 가져올 수 없습니다');
          }

          let buffer = '';
          let currentEventType = 'message';
          let currentData = '';
          let chunkCount = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('🔔 SSE: 스트림 종료됨 (총 청크 수:', chunkCount, ')');
              break;
            }

            chunkCount++;
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // 디버깅: 받은 청크 로그 (처음 몇 바이트만)
            if (chunk.length > 0) {
              console.log(`🔔 SSE: 데이터 청크 #${chunkCount} 수신 (${chunk.length} bytes, 처음 200자):`, chunk.substring(0, 200));
            } else {
              console.log(`🔔 SSE: 빈 청크 #${chunkCount} 수신`);
            }

            // 줄 단위로 분리
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              
              // 빈 줄이 아닌 경우에만 처리
              if (trimmedLine === '') {
                // 빈 줄 = 이벤트 종료
                if (currentData || currentEventType !== 'message') {
                  console.log('🔔 SSE: 이벤트 완료 - 타입:', currentEventType, '데이터 길이:', currentData.length);
                  
                  if (currentEventType === 'connect') {
                    console.log('🔔 SSE connect 이벤트 수신:', currentData);
                    setIsConnected(true);
                    reconnectAttempts.current = 0;
                  } else if (currentEventType === 'notification') {
                    try {
                      const notification: NotificationResponseDTO = JSON.parse(currentData);
                      console.log('🔔 새로운 알림 도착:', notification);
                      onNotification?.(notification);
                    } catch (error) {
                      console.error('🔔 알림 파싱 오류:', error, '원본 데이터:', currentData);
                    }
                  } else if (currentData) {
                    // 기본 이벤트 타입이지만 데이터가 있는 경우
                    console.log('🔔 SSE 기본 이벤트 (타입:', currentEventType, '):', currentData.substring(0, 200));
                  }
                  
                  currentData = '';
                  currentEventType = 'message';
                }
              } else if (trimmedLine.startsWith('event:')) {
                currentEventType = trimmedLine.slice(6).trim();
                console.log('🔔 SSE: 이벤트 타입 감지:', currentEventType);
              } else if (trimmedLine.startsWith('data:')) {
                const data = trimmedLine.slice(5).trim();
                // 여러 줄의 data가 올 수 있으므로 누적
                if (currentData) {
                  currentData += '\n' + data;
                } else {
                  currentData = data;
                }
              } else if (trimmedLine.startsWith('id:')) {
                // SSE id 필드 (선택사항)
                console.log('🔔 SSE: 이벤트 ID:', trimmedLine.slice(3).trim());
              } else if (trimmedLine.startsWith('retry:')) {
                // SSE retry 필드 (선택사항)
                console.log('🔔 SSE: 재시도 간격:', trimmedLine.slice(6).trim());
              } else if (trimmedLine.length > 0) {
                // 알 수 없는 형식의 줄
                console.log('🔔 SSE: 알 수 없는 형식의 줄:', trimmedLine.substring(0, 100));
              }
            }
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            return; // 정상적인 중단
          }
          console.error('SSE 스트림 읽기 오류:', error);
          setIsConnected(false);

          // 재연결 시도
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectDelay);
          } else {
            console.error('SSE 재연결 시도 횟수 초과');
          }
        });

      eventSourceRef.current = abortController;

    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.abort();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [onNotification]);

  return { isConnected };
}

