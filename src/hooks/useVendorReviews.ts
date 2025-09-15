// src/hooks/useVendorReviews.ts
'use client';

import { getVendorReviews, type RawVendorReview, type ReviewSort } from '@/services/vendor-review.api';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useVendorReviews(vendorId: number, pageSize = 6, sort: ReviewSort) {
  const [items, setItems] = useState<RawVendorReview[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const inflight = useRef(false);
  const sortRef = useRef(sort);

  // sort 바뀌면 리셋
  useEffect(() => {
    if (sortRef.current !== sort) {
      sortRef.current = sort;
      setItems([]);
      setPage(0);
      setHasNext(true);
    }
  }, [sort]);

  const load = useCallback(async () => {
    if (loading || inflight.current || !hasNext) return;
    inflight.current = true;
    setLoading(true);
    try {
      const res = await getVendorReviews(vendorId, page, pageSize, sort);
      setItems(prev => [...prev, ...res.reviews]);
      setHasNext(!res.last);
      setPage(p => p + 1);
    } finally {
      setLoading(false);
      inflight.current = false;
    }
  }, [vendorId, page, pageSize, sort, loading, hasNext]);

  return { items, hasNext, loading, load, reset: () => { setItems([]); setPage(0); setHasNext(true); } };
}