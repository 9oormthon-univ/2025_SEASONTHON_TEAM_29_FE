// src/components/auth/AuthGuard.tsx
'use client';

import { isExpired } from '@/lib/jwt';
import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';
import { reissueOnce } from '@/services/http';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** 보호 페이지를 감싸서, 토큰 만료/부재 시 리이슈 또는 홈('/') 이동 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const at = tokenStore.get();

      // 1) 액세스 토큰 없음 → 홈으로
      if (!at) return goHome();

      // 2) 유효하면 통과
      if (!isExpired(at)) {
        if (alive) setReady(true);
        return;
      }

      // 3) 만료면 1회 재발급
      const ok = await reissueOnce().catch(() => false);
      if (!ok) return goHome();

      // 4) 재발급 성공 → 통과
      if (alive) setReady(true);
    })();

    function goHome() {
      tokenStore.clear?.();
      refreshStore.clear?.();
      router.replace('/'); // 요구사항: 실패시 '/'로
    }

    return () => { alive = false; };
  }, [pathname, router]);

  if (!ready) {
    // 검증중 UI (원하면 바꿔도 됨)
    return <div className="grid min-h-dvh place-items-center text-sm text-text-secondary">인증 확인 중…</div>;
  }

  return <>{children}</>;
}