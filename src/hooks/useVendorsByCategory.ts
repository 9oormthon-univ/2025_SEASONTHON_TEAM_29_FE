// src/hooks/useVendorsByCategory.ts
'use client';

import { getVendorsByCategory, type VendorCategory } from '@/services/vendor.api';
import type { VendorItem } from '@/types/vendor';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useVendorsByCategory(
  category: VendorCategory,
  pageSize = 10,
  opts?: { auto?: boolean }
) {
  const [items, setItems] = useState<VendorItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  // 중복 요청 방지용 플래그 + 최신값 참조용 ref
  const inFlightRef = useRef(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);

  // state ↔ ref 동기화
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const load = useCallback(async () => {
    if (inFlightRef.current) return;        // ✅ 동시에 두 번 못 들어오게
    if (!hasMoreRef.current) return;        // ✅ 더 없으면 종료

    inFlightRef.current = true;             // ✅ 진입 즉시 잠금(동기)
    setLoading(true);

    try {
      const { items: chunk, hasNext } = await getVendorsByCategory(
        category,
        pageRef.current,
        pageSize,
        { skipAuth: true }
      );

      setItems(prev => [...prev, ...chunk]);
      setHasMore(hasNext);
      setPage(prev => prev + 1);            // state
      pageRef.current += 1;                  // ref도 증가(다음 요청 대비)
      hasMoreRef.current = hasNext;
    } catch (e) {
      setErr(e instanceof Error ? e.message : '업체 목록을 불러오지 못했어요.');
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      inFlightRef.current = false;          // ✅ 해제
      setLoading(false);
    }
  }, [category, pageSize]);

  // 카테고리/페이지크기 변경 시 초기화
  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setErr(null);
    pageRef.current = 0;
    hasMoreRef.current = true;
    inFlightRef.current = false;

    if (opts?.auto !== false) {
      // 초기 1회 로드
      void load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageSize]);

  return { items, loading, error, hasMore, loadMore: load };
}