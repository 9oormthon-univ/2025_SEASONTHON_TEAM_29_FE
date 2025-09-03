// src/app/(public)/(auth)/callback/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const sp = useSearchParams();
  useEffect(() => {
    const qs = sp.toString();
    window.location.href = `/api/auth/callback?${qs}`; // 서버 라우트로 넘겨 쿠키 세팅
  }, [sp]);
  return <div className="p-6">로그인 중…</div>;
}