'use client';

import { tokenStore } from '@/lib/tokenStore';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/** 보호 페이지를 감싸서, 토큰 없으면 /login 으로 튕김 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const t = tokenStore.get();
    if (!t) {
      // pathname + queryString 모두 보존
      const query = sp.toString();
      const nextPath = query ? `${pathname}?${query}` : pathname || '/';
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [mounted, pathname, sp, router]);

  if (!mounted) return null; // 또는 스피너

  return <>{children}</>;
}