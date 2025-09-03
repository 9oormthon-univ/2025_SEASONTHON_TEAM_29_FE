// src/app/(public)/(auth)/callback/page.tsx
'use client';

import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type OAuthLoginData = {
  accessToken?: string;
  refreshToken?: string;
  isNew?: boolean;
  needMoreInfo?: boolean;
};
type Envelope<T> = { status: number; success: boolean; message?: string; data?: T };

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. https://wedit.me/api

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // 쿼리스트링 그대로 전달 (Suspense 불필요)
      const qs = typeof window !== 'undefined' ? window.location.search : '';
      const url = new URLSearchParams(qs);
      const code = url.get('code');
      const state = url.get('state');

      if (!code) {
        router.replace('/login?e=no_code');
        return;
      }

      try {
        // (필요하면 redirect_uri도 함께 전달하세요 — 백엔드가 검증한다면)
        const be = await fetch(
          `${API}/v1/member/oauth-login?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state ?? '')}`,
          { method: 'GET', cache: 'no-store' }
        );
        if (!be.ok) {
          router.replace('/login?e=exchange_fail');
          return;
        }

        const json = (await be.json()) as Envelope<OAuthLoginData>;
        const at = json?.data?.accessToken;
        const rt = json?.data?.refreshToken;

        if (at) tokenStore.set(at);
        if (rt) refreshStore.set(rt);

        if (json?.data?.isNew || json?.data?.needMoreInfo) {
          router.replace('/social'); // 소셜 회원가입 페이지
        } else {
          router.replace('/home');   // 기존 사용자
        }
      } catch {
        router.replace('/login?e=network');
      }
    })();
  }, [router]);

  return <div className="p-6">로그인 중…</div>;
}

// ✅ 절대 프리렌더하지 않도록
export const dynamic = 'force-dynamic';
export const revalidate = 0;