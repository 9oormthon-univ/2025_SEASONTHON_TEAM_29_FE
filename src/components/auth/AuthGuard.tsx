// src/components/auth/AuthGuard.tsx
'use client';

import { tokenStore } from '@/lib/tokenStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** 보호 페이지를 감싸서, 토큰 없으면 /login 으로 튕김 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    const t = tokenStore.get();
    if (!t) {
      // ✅ 쿼리는 window.location.search로 읽기 (useSearchParams 사용 금지)
      const qs = typeof window !== 'undefined' ? window.location.search : '';
      const nextPath = qs ? `${pathname}${qs}` : (pathname || '/');
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [mounted, pathname, router]);

  if (!mounted) return null;
  return <>{children}</>;
}