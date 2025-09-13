'use client';
import { fetchLatLngByKeyword } from '@/lib/kakao';
import { useEffect, useRef, useState } from 'react';

export function useAutoGeocode(address: string, enabled = false) {
  const [loading, setLoading] = useState(false);
  const [coord, setCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(async () => {
      const q = address.trim();
      if (q.length < 2) return; // 너무 짧으면 skip
      setLoading(true);
      setError(null);
      try {
        const c = await fetchLatLngByKeyword(q);
        setCoord(c);
        if (!c) setError('좌표를 찾지 못했습니다.');
      } catch {
        setError('좌표 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }, 500); // 0.5s 디바운스

    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [address, enabled]);

  return { loading, coord, error };
}