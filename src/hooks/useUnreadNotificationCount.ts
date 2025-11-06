// src/hooks/useUnreadNotificationCount.ts
'use client';

import { getUnreadCount } from '@/services/notification.api';
import { useEffect, useState } from 'react';

export function useUnreadNotificationCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchCount() {
      try {
        const unreadCount = await getUnreadCount();
        if (mounted) {
          setCount(unreadCount);
        }
      } catch (error) {
        console.error('안 읽은 알림 개수 조회 실패:', error);
        if (mounted) {
          setCount(0);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCount();

    return () => {
      mounted = false;
    };
  }, []);

  return { count: count ?? 0, loading };
}



