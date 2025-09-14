// src/hooks/useMyContracts.ts
import { getMyContracts } from '@/services/contract.api';
import type { MyContractsRes } from '@/types/contract';
import { useEffect, useState } from 'react';

export function useMyContracts(page = 0, size = 10) {
  const [data, setData] = useState<MyContractsRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyContracts(page, size);
        setData(res);
      } catch (e) {
        setErr(e instanceof Error ? e.message : '계약 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, [page, size]);

  return { data, loading, error };
}