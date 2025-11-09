// src/components/providers/NotificationProvider.tsx
'use client';

import NotificationToast from '@/components/common/NotificationToast';
import { useNotificationSSE } from '@/hooks/useNotificationSSE';
import { tokenStore } from '@/lib/tokenStore';
import type { NotificationResponseDTO } from '@/types/notification';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type ToastNotification = NotificationResponseDTO & { toastKey: string };

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    console.log('🔔 NotificationProvider 마운트됨');
  }, []);

  const handleNotification = useCallback(
    (notification: NotificationResponseDTO) => {
      console.log('🔔 알림 수신됨:', notification);
      // 토스트에 추가
      const toastKey = `toast-${notification.id}-${Date.now()}`;
      const toast: ToastNotification = { ...notification, toastKey };
      setToasts((prev) => {
        const next = [...prev, toast];
        console.log('🔔 토스트 추가됨. 총 개수:', next.length);
        return next;
      });

      // 안 읽은 알림 개수 갱신 (간단하게 +1)
      // 실제로는 API를 다시 호출하거나 SSE에서 개수 정보를 받아야 함
    },
    [],
  );

  // SSE 연결 (로그인 상태일 때만)
  // useEffect를 사용하여 토큰 변경 감지
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const checkToken = () => {
      const currentToken = tokenStore.get();
      setToken(currentToken);
    };
    
    checkToken();
    // 주기적으로 토큰 체크 (로그인/로그아웃 감지)
    const interval = setInterval(checkToken, 1000);
    return () => clearInterval(interval);
  }, []);

  const { isConnected } = useNotificationSSE(token ? handleNotification : undefined);
  
  useEffect(() => {
    console.log('🔔 SSE 연결 상태:', isConnected);
    console.log('🔔 현재 토큰:', token ? '있음' : '없음');
  }, [isConnected, token]);
  
  // 디버깅: 토스트 상태 확인
  useEffect(() => {
    console.log('🔔 NotificationProvider - 토스트 개수:', toasts.length);
    if (toasts.length > 0) {
      console.log('🔔 현재 토스트들:', toasts);
    }
  }, [toasts]);

  // 테스트 및 수동 트리거 함수 노출
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 테스트 알림
      window.testNotification = () => {
        const testNotif: NotificationResponseDTO = {
          id: Date.now(),
          category: '일정',
          title: '테스트 알림',
          content: '이것은 테스트 알림입니다.',
          targetDomainType: 'MAIN',
          targetDomainId: 0,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        handleNotification(testNotif);
        console.log('🔔 테스트 알림 전송됨');
      };
      
      // 예약 성공 알림 트리거 (예약 성공 시 호출 가능)
      window.triggerReservationNotification = (reservationId: number, vendorName?: string) => {
        const notif: NotificationResponseDTO = {
          id: Date.now(),
          category: '일정',
          title: '예약 확정',
          content: vendorName 
            ? `'${vendorName}' 상담 예약이 확정되었어요.`
            : '상담 예약이 확정되었어요.',
          targetDomainType: 'RESERVATION',
          targetDomainId: reservationId,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        handleNotification(notif);
        console.log('🔔 예약 알림 트리거됨:', notif);
      };
    }
  }, [handleNotification]);

  const handleToastClose = useCallback((toastKey: string) => {
    setToasts((prev) => prev.filter((toast) => toast.toastKey !== toastKey));
  }, []);

  const handleToastClick = useCallback(
    (notification: NotificationResponseDTO) => {
      // targetDomainType에 따라 페이지 이동
      const { targetDomainType, targetDomainId } = notification;

      let path = '/notification'; // 기본값

      switch (targetDomainType) {
        case 'RESERVATION':
          path = `/reservation/${targetDomainId}`;
          break;
        case 'CONTRACT':
          path = `/mypage/contracts/${targetDomainId}`;
          break;
        case 'CALENDAR':
          path = '/calendar';
          break;
        case 'REVIEW':
          path = `/review/${targetDomainId}`;
          break;
        case 'MY_PAGE':
          path = '/mypage';
          break;
        case 'INVITATION':
          path = '/mypage/invite/view';
          break;
        case 'MAIN':
          path = '/home';
          break;
        default:
          path = '/notification';
      }

      router.push(path);
      // 토스트는 자동으로 닫히므로 여기서는 닫지 않음
    },
    [router],
  );

  return (
    <>
      {children}
      {/* 토스트 알림들 */}
      {toasts.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none flex flex-col items-center">
          {toasts.map((toast, index) => (
            <div
              key={toast.toastKey}
              className="pointer-events-auto w-full"
              style={{ 
                marginTop: index === 0 ? '16px' : `${index * 100}px`,
                maxWidth: '420px',
                zIndex: 9999 + index,
              }}
            >
              <NotificationToast
                notification={toast}
                onClose={() => handleToastClose(toast.toastKey)}
                onClick={() => handleToastClick(toast)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

