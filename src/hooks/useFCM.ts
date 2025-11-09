// src/hooks/useFCM.ts
'use client';

import { registerFCMToken } from '@/services/notification.api';
import { tokenStore } from '@/lib/tokenStore';
import { useEffect, useState } from 'react';

// Firebase 설정
const firebaseConfig = {
  apiKey: 'AIzaSyDwxxQ7YJvcEi-w0qgFMcV7Yh9N0Bx1-vM',
  authDomain: 'wedit-18c49.firebaseapp.com',
  projectId: 'wedit-18c49',
  storageBucket: 'wedit-18c49.firebasestorage.app',
  messagingSenderId: '424935306785',
  appId: '1:424935306785:web:5cded7dc992ab010fe9560',
};

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Firebase가 이미 초기화되었는지 확인
    if (typeof window === 'undefined') return;

    async function initFCM() {
      try {
        // Firebase SDK 동적 import
        const { initializeApp, getApps } = await import('firebase/app');
        const { getMessaging, getToken, isSupported, onMessage } = await import(
          'firebase/messaging',
        );

        // Firebase 초기화
        let app;
        if (getApps().length === 0) {
          app = initializeApp(firebaseConfig);
        } else {
          app = getApps()[0];
        }

        // FCM 지원 여부 확인
        const isFCMSupported = await isSupported();
        if (!isFCMSupported) {
          console.log('🔔 FCM: 이 브라우저는 FCM을 지원하지 않습니다');
          return;
        }

        const messaging = getMessaging(app);

        // FCM 토큰 가져오기
        const fcmToken = await getToken(messaging, {
          vapidKey:
            'BEl62iUYgUivxIkv69yViEuiBIa1bQJzV3u9D5E2Y5fBQ7K8xL0mN1oP2qR3sT4uV5wX6yZ7aA8bB9cC0dD',
        });

        if (fcmToken) {
          console.log('🔔 FCM 토큰 발급됨:', fcmToken);
          setToken(fcmToken);

          // 서버에 토큰 등록
          const accessToken = tokenStore.get();
          if (accessToken) {
            try {
              await registerFCMToken(fcmToken);
              console.log('🔔 FCM 토큰 서버 등록 완료');
            } catch (err) {
              console.error('🔔 FCM 토큰 서버 등록 실패:', err);
              setError('FCM 토큰 등록 실패');
            }
          }
        } else {
          console.log('🔔 FCM: 토큰을 가져올 수 없습니다');
        }

        // 포그라운드 메시지 수신 처리
        onMessage(messaging, (payload) => {
          console.log('🔔 FCM 포그라운드 메시지 수신:', payload);
          // 여기서 토스트 알림을 표시할 수 있습니다
        });
      } catch (err) {
        console.error('🔔 FCM 초기화 오류:', err);
        setError(err instanceof Error ? err.message : 'FCM 초기화 실패');
      }
    }

    initFCM();
  }, []);

  return { token, error };
}


