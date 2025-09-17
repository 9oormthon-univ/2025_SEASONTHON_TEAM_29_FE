// src/hooks/useVendorReviewStats.ts
import { getErrorMessage } from '@/services/mypage.api';
import { getVendorReviewStats, type VendorReviewStatsType } from '@/services/vendor-review.api';
import { useEffect, useState } from 'react';

export function useVendorReviewStats(vendorId: number) {
  const [data, setData] = useState<VendorReviewStatsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const d = await getVendorReviewStats(vendorId);
        if (alive) setData(d);
      } catch (e) {
        if (alive) setErr(getErrorMessage(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [vendorId]);

  return { data, loading, error };
}