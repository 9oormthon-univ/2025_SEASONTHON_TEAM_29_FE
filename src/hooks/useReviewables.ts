import { getReviewableContracts, type ReviewableContract } from '@/services/contract.api';
import { getErrorMessage } from '@/services/mypage.api';
import { useCallback, useEffect, useState } from 'react';

export function useReviewables(pageSize = 30) {
  const [items, setItems] = useState<ReviewableContract[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const { items: chunk, hasNext } = await getReviewableContracts(page, pageSize);
  
      setItems((prev) => {
        const merged = [...prev, ...chunk];
        // contractId 기준 중복 제거
        return merged.filter(
          (item, idx, arr) =>
            arr.findIndex((x) => x.contractId === item.contractId) === idx
        );
      });
  
      setHasMore(hasNext);
      setPage((p) => p + 1);
    } catch (e) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, hasMore, loadMore: load };
}