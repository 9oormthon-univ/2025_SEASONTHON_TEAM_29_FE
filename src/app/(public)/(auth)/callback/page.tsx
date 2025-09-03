// src/app/(public)/(auth)/callback/page.tsx
'use client';
import { refreshStore } from '@/lib/refreshStore';
import { tokenStore } from '@/lib/tokenStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type OAuthLoginData = {
  accessToken?: string;
  refreshToken?: string;
  isNew?: boolean;          // 백엔드가 신규 여부 명시
  needMoreInfo?: boolean;   // 선택: 추가정보 필요 플래그
};
type Envelope<T> = { status: number; success: boolean; message?: string; data?: T };

const API = process.env.NEXT_PUBLIC_API_URL!;

export default function AuthCallbackPage() {
  const sp = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = sp.get('code');
    const state = sp.get('state');

    (async () => {
      if (!code) {
        router.replace('/login?e=no_code');
        return;
      }
      try {
        const be = await fetch(`${API}/v1/member/oauth-login?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state ?? '')}`, {
          method: 'GET',
          cache: 'no-store',
        });
        if (!be.ok) {
          router.replace('/login?e=exchange_fail');
          return;
        }
        const json: Envelope<OAuthLoginData> = await be.json().catch(() => ({ success: false, status: 500 }));
        const at = json.data?.accessToken;
        const rt = json.data?.refreshToken;

        if (at) tokenStore.set(at);
        if (rt) refreshStore.set(rt);

        // 분기: 신규/추가입력 필요 → 소셜 회원가입
        if (json.data?.isNew || json.data?.needMoreInfo) {
          router.replace('/social');
        } else {
          router.replace('/home');
        }
      } catch {
        router.replace('/login?e=network');
      }
    })();
  }, [sp, router]);

  return <div className="p-6">로그인 중…</div>;
}