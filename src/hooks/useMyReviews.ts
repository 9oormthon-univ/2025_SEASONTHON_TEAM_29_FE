// src/hooks/useMyReviews.ts
import { fetchMyReviews } from '@/lib/mypageUtils';
import { getErrorMessage } from '@/services/mypage.api';
import type { ReviewCompany } from '@/types/mypage';
import { useCallback, useEffect, useState } from 'react';

export function useMyReviews(pageSize = 9) {
  const [items, setItems] = useState<ReviewCompany[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const { items: chunk, hasNext } = await fetchMyReviews(page, pageSize);
      setItems((s) => [...s, ...chunk]);
      setHasMore(hasNext);
      setPage((p) => p + 1);
    } catch (e) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  useEffect(() => {
    // 첫 로드
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, hasMore, loadMore: load };
}