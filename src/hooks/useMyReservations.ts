// src/hooks/useMyReservations.ts
import { fetchMyReservations } from '@/lib/mypageUtils';
import { getErrorMessage } from '@/services/mypage.api';
import type { MyReservation } from '@/types/mypage';
import { useEffect, useState } from 'react';

export function useMyReservations() {
  const [data, setData] = useState<MyReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setData(await fetchMyReservations());
      } catch (e) {
        setErr(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}