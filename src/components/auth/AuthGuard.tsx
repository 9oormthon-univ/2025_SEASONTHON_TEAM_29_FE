'use client';

import { tokenStore } from '@/lib/tokenStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

/** 보호 페이지를 감싸서, 토큰 없으면 /login 으로 튕김 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // tokenStore 가 메모리/스토리지 어디에 있든 get() 으로 현재 토큰 조회
  const token = useMemo(() => tokenStore.get(), []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // 첫 마운트 이후에만 검사 (SSR 플래시 방지)
    if (!mounted) return;

    const t = tokenStore.get();
    if (!t) {
      // 원래 가려던 경로 보존
      const next = encodeURIComponent(pathname || '/');
      router.replace(`/login?next=${next}`);
    }
  }, [mounted, pathname, router]);

  // 마운트 전엔 빈 상태 렌더(혹은 스피너)
  if (!mounted) return null;

  // 토큰 없으면 위의 effect에서 리다이렉트될 거라, children 노출되어도 순간만 보임
  return <>{children}</>;
}