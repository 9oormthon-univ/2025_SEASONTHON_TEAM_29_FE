// src/hooks/useMyProfile.ts
import { fetchMyProfile } from '@/lib/mypageUtils';
import { getErrorMessage } from '@/services/mypage.api';
import type { MyProfile } from '@/types/mypage';
import { useEffect, useState } from 'react';

export function useMyProfile() {
  const [data, setData] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setData(await fetchMyProfile());
      } catch (e) {
        setErr(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}