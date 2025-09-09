// src/hooks/useVendorsByCategory.ts
'use client';

import { vendorKey } from '@/lib/vendorKey';
import { getVendorsByCategory, type VendorCategory } from '@/services/vendor.api';
import type { VendorItem } from '@/types/vendor';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useVendorsByCategory(category: VendorCategory, pageSize = 10, opts?: { auto?: boolean }) {
  const [items, setItems] = useState<VendorItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);

  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  const load = useCallback(async () => {
    if (inFlightRef.current) return;
    if (!hasMoreRef.current) return;

    inFlightRef.current = true;
    setLoading(true);

    try {
      const { items: chunk, hasNext } = await getVendorsByCategory(
        category, pageRef.current, pageSize, { skipAuth: true }
      );

      // ✅ 중복 제거 병합 (StrictMode 2회 호출에도 안전)
      setItems(prev => {
        const merged = [...prev, ...chunk];
        const map = new Map<string, VendorItem>();
        for (const it of merged) map.set(vendorKey(it), it);
        return Array.from(map.values());
      });

      setHasMore(hasNext);
      setPage(p => p + 1);
      pageRef.current += 1;
      hasMoreRef.current = hasNext;
    } catch (e) {
      setErr(e instanceof Error ? e.message : '업체 목록을 불러오지 못했어요.');
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [category, pageSize]);

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    setErr(null);
    pageRef.current = 0;
    hasMoreRef.current = true;
    inFlightRef.current = false;

    if (opts?.auto !== false) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageSize]);

  return { items, loading, error, hasMore, loadMore: load };
}