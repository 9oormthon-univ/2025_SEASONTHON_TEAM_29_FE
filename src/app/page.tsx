'use client';

import { tokenStore } from '@/lib/tokenStore';
import * as auth from '@/services/auth.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SplashPage() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // 이미 메모리에 토큰 있으면 바로 home
        if (tokenStore.get()) {
          go('/home');
          return;
        }
        // 없으면 refresh 시도
        await auth.reissueToken();
        if (tokenStore.get()) {
          go('/home');
        } else {
          go('/welcome');
        }
      } catch {
        go('/welcome');
      }
    };

    // 살짝 연출 (원하시면 시간 조정/삭제)
    const t1 = setTimeout(() => setFadeOut(true), 700);
    const t2 = setTimeout(bootstrap, 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };

    function go(path: string) {
      // 페이드 아웃 타이밍에 맞춰 전환
      setTimeout(() => router.replace(path), 300);
    }
  }, [router]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-primary-500">
      <Image
        src="/icons/logo.svg"
        alt="웨딧"
        width={160}
        height={80}
        className={`h-20 w-auto ${fadeOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        aria-hidden
      />
      <span className="sr-only">웨딧</span>
    </main>
  );
}