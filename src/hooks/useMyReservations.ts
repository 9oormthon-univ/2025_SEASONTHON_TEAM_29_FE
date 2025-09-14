import { getMyReservations } from '@/services/reservation.api';
import type { MyReservation } from '@/types/reservation';
import { useEffect, useState } from 'react';

export function useMyReservations() {
  const [data, setData] = useState<MyReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setData(await getMyReservations());
      } catch (e) {
        setErr(e instanceof Error ? e.message : '예약 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}