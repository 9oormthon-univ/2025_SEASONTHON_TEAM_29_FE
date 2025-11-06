// src/hooks/useNotifications.ts
'use client';

import { getNotifications } from '@/services/notification.api';
import type { NotificationCategory, NotificationResponseDTO } from '@/types/notification';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useNotifications(
  category: NotificationCategory = '전체',
  pageSize = 20,
) {
  const [items, setItems] = useState<NotificationResponseDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 중복 호출 방지용 플래그
  const inflight = useRef(false);
  const prevCategoryRef = useRef(category);

  // 카테고리 변경 시 리셋
  useEffect(() => {
    if (prevCategoryRef.current !== category) {
      prevCategoryRef.current = category;
      setItems([]);
      setPage(0);
      setHasMore(true);
      setError(null);
    }
  }, [category]);

  const load = useCallback(async () => {
    if (loading || inflight.current || !hasMore) return;
    inflight.current = true;
    try {
      setLoading(true);
      setError(null);
      const currentPage = page;
      const response = await getNotifications({
        page: currentPage,
        size: pageSize,
        category: category === '전체' ? undefined : category,
      });

      setItems((prev) => [...prev, ...response.content]);
      setHasMore(!response.last);
      setPage((p) => p + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알림을 불러오지 못했어요.');
      setHasMore(false);
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [page, pageSize, category, loading, hasMore]);

  // 초기 로드
  useEffect(() => {
    if (items.length === 0 && page === 0 && !loading && hasMore) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, loading, error, hasMore, loadMore: load, reset };
}
