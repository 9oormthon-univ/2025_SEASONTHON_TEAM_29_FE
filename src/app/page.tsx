// app/page.tsx (WelcomeAsRoot)
'use client';

import AuthCtas from '@/components/onboarding/AuthCtas';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';
import { isStandalonePWA } from '@/lib/pwa';
import { tokenStore } from '@/lib/tokenStore';
import * as auth from '@/services/auth.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const MIN_OVERLAY_MS = 800;   // 브라우저에서만 사용
const SHOW_AFTER_MS   = 120;  // 짧게 끝나면 오버레이 자체를 안 띄움 (브라우저 전용)

export default function WelcomeAsRoot() {
  const router = useRouter();
  const installed = isStandalonePWA(); // ✅ PWA 여부

  const [booting, setBooting] = useState(true);
  const [showOverlay, setShowOverlay] = useState(!installed); 
  const startedAt = useRef<number>(Date.now());
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    if (!installed) {
      const t = window.setTimeout(() => setShowOverlay(true), SHOW_AFTER_MS);
      timers.current.push(t);
    }

    (async () => {
      if (tokenStore.get()) {
        if (!cancelled) await go('/home');
        return;
      }
      const ok = await auth.reissueToken().catch(() => false);

      if (cancelled) return;

      if (ok && tokenStore.get()) {
        await go('/home');
      } else {
        await finish();
      }
    })();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, installed]);

  async function finish() {
    if (!installed) {
      const elapsed = Date.now() - startedAt.current;
      const wait = Math.max(0, MIN_OVERLAY_MS - elapsed);
      await new Promise<void>((r) => {
        const id = window.setTimeout(() => r(), wait);
        timers.current.push(id);
      });
    }
    setBooting(false);
    setShowOverlay(false);
  }

  async function go(path: string) {
    await finish();
    router.replace(path);
  }

  const hideWelcome = booting && installed; // ✅ PWA일 때 부팅중이면 웰컴 콘텐츠 숨김

  return (
    <main className="relative mx-auto flex h-dvh max-w-[420px] flex-col">
      {/* 브라우저 전용 스플래시 오버레이 */}
      {booting && showOverlay && !installed && (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-primary-500">
          <Image
            src="/icons/logo.svg"
            alt="웨딧"
            width={160}
            height={80}
            className="h-20 w-auto animate-fadeIn"
            priority
          />
          <span className="sr-only">웨딧</span>
        </div>
      )}

      {/* 웰컴 화면 (PWA에선 부팅중일 땐 숨김) */}
      <div className={hideWelcome ? 'invisible pointer-events-none' : 'flex h-dvh flex-col'}>
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-onboarding-gradient" />
        <div className="relative z-10 flex-1 pt-6">
          <OnboardingSlider />
        </div>
        <div className="relative z-10 px-4 pb-[calc(env(safe-area-inset-bottom)+50px)]">
          <AuthCtas />
        </div>
      </div>
    </main>
  );
}