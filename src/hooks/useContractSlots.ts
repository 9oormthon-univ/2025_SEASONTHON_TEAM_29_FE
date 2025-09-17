import { getAvailableSlots } from '@/services/contract.api';
import type { ContractSlot } from '@/types/contract';
import { useCallback, useEffect, useState } from 'react';

export function useContractSlots(productId: number, months: number[]) {
  const [slots, setSlots] = useState<ContractSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      setErr(null);
      const res = await getAvailableSlots(productId, months);
      setSlots(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : '슬롯 조회 실패');
    } finally {
      setLoading(false);
    }
  }, [productId, months]);

  useEffect(() => {
    void load();
  }, [load]);

  return { slots, loading, error, refetch: load };
}