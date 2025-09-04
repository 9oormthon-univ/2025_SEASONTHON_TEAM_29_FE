// src/app/(public)/(auth)/oauth/callback/page.tsx
'use client';

import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const qs = window.location.search;
      const query = new URLSearchParams(qs);

      // ✅ 백엔드가 내려주는 파라미터
      const at = query.get('token');        // access token
      const rt = query.get('refresh');      // refresh token
      const rawIsNew = query.get('isNewUser');

      console.log('🔑 from callback:', { at, rt, rawIsNew });

      if (at) tokenStore.set(at);
      if (rt) refreshStore.set(rt);

      // 민감 쿼리 지우기
      if (at || rt || rawIsNew !== null) {
        try {
          window.history.replaceState({}, '', window.location.pathname);
        } catch {/* noop */}
      }

      const isNew = rawIsNew === 'true';

      if (!at) {
        router.replace('/login?e=no_token');
        return;
      }

      if (isNew) {
        router.replace('/social');
      } else {
        router.replace('/home');
      }
    })();
  }, [router]);

  return <div className="p-6">로그인 중…</div>;
}

export const dynamic = 'force-dynamic';