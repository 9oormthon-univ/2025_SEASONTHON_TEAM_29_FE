// src/components/auth/AuthGate.tsx
'use client';

import { tokenStore } from '@/lib/tokenStore';
import * as auth from '@/services/auth.api';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    let mounted = true;

    const goWelcome = () => {
      if (!mounted) return;
      router.replace('/welcome');
    };

    const ensure = async () => {
      if (tokenStore.get()) {
        setReady(true);
        return;
      }
      const ok = await auth.reissueToken().catch(() => false);
      if (!mounted) return;
      if (ok && tokenStore.get()) setReady(true);
      else goWelcome();
    };

    ensure();
    return () => {
      mounted = false;
    };
  }, [router, path]);

  if (!ready) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-white">
        {/* 로고 */}
        <Image
          src="/icons/logo.svg"
          alt="웨딧"
          width={120}
          height={60}
          className="h-12 w-auto animate-bounce"
          priority
        />
        {/* 로딩 텍스트 */}
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          잠시만 기다려주세요…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}