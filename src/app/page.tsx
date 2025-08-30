'use client';

import { tokenStore } from '@/lib/tokenStore';
import * as auth from '@/services/auth.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';


const FADE_MS = 300;
const MIN_SHOW_MS = 700;

export default function SplashPage() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);
  const timers = useRef<number[]>([]);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    const bootstrap = async () => {
      // 1) 토큰 있으면 바로 홈
      if (tokenStore.get()) {
        await go('/home');
        return;
      }

      // 2) 없으면 리프레시 시도
      try {
        await auth.reissueToken();
        await go(tokenStore.get() ? '/home' : '/welcome');
      } catch {
        await go('/welcome');
      }
    };

    bootstrap();

    return () => {
      // 타이머 정리
      timers.current.forEach(clearTimeout);
    };
  }, [router]);

  async function go(path: string) {
    // (선택) 스플래시 최소 노출 시간 보장
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);
    await new Promise<void>((r) => {
      const id = window.setTimeout(() => r(), wait);
      timers.current.push(id);
    });

    setFadeOut(true); // 이제 페이드아웃 시작

    await new Promise<void>((r) => {
      const id = window.setTimeout(() => r(), FADE_MS);
      timers.current.push(id);
    });

    router.replace(path);
  }


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