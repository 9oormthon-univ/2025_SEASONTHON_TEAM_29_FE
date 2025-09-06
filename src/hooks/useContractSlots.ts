'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContractAvailabilityReq, ContractSlot } from '@/types/estimate';
import { fetchContractSlots } from '@/services/estimates.api';

type UseContractSlotsOpts = {
  vendorId: number;
  year?: number;
  months?: number[];
  pageSize?: number;
};

export function useContractSlots(opts: UseContractSlotsOpts) {
  const now = useMemo(() => new Date(), []);
  const defaultYear = now.getFullYear();
  const defaultMonths = useMemo(() => {
    const m = now.getMonth() + 1;
    return [m, m + 1, m + 2].map((x) => ((x - 1) % 12) + 1);
  }, [now]);

  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ContractSlot[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const params: ContractAvailabilityReq = {
    year: opts.year ?? defaultYear,
    months: opts.months ?? defaultMonths,
    page,
    size: opts.pageSize ?? 10,
  };

  const load = useCallback(
    async (reset = false) => {
      if (abortRef.current) abortRef.current.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setLoading(true);
      setErr(null);

      try {
        const {
          items: newItems,
          page: cur,
          totalPages: tp,
        } = await fetchContractSlots(opts.vendorId, params, ac.signal);

        setTotalPages(tp);
        setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
      } catch (e) {
        setErr(
          e instanceof Error ? e.message : '슬롯 조회 중 오류가 발생했습니다.',
        );
      } finally {
        setLoading(false);
      }
    },
    [
      opts.vendorId,
      params.year,
      params.months.join(','),
      params.page,
      params.size,
    ],
  );

  const refetch = useCallback(() => load(true), [load]);

  const loadNext = useCallback(() => {
    setPage((p) => (p < totalPages ? p + 1 : p));
  }, [totalPages]);

  useEffect(() => {
    load(page === 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, params.year, params.months.join(','), params.size, opts.vendorId]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    slots: items,
    loading,
    error: err,
    page,
    totalPages,
    loadNext,
    refetch,
    setPage,
  };
}
