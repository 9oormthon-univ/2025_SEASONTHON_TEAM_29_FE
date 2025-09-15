'use client';

import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** 보호 페이지를 감싸서, 토큰 없거나 refresh 불가 시 홈('/') 이동 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const at = tokenStore.get();
    const rt = refreshStore.get();

    if (!at || !rt) {
      tokenStore.clear?.();
      refreshStore.clear?.();
      router.replace('/');
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-text-secondary">
        인증 확인 중…
      </div>
    );
  }

  return <>{children}</>;
}