// src/hooks/useHomeReviews.ts
'use client';

import { getHomeReviews, type HomeReviewItem } from '@/services/review.api';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useHomeReviews(pageSize = 10, opts?: { auto?: boolean }) {
  const [items, setItems] = useState<HomeReviewItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  // 중복 호출 방지용 플래그
  const inflight = useRef(false);

  const load = useCallback(async () => {
    if (loading || inflight.current || !hasMore) return;
    inflight.current = true;
    try {
      setLoading(true);
      const { items: chunk, hasNext } = await getHomeReviews(page, pageSize);
      setItems((prev) => [...prev, ...chunk]);
      setHasMore(hasNext);
      setPage((p) => p + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : '리뷰를 불러오지 못했어요.');
      setHasMore(false);
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [page, pageSize, loading, hasMore]);

  // 초기 로드
  useEffect(() => {
    if (opts?.auto === false) return;
    // 첫 마운트 1회만
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error, hasMore, loadMore: load };
}