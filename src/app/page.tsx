// app/page.tsx (WelcomeAsRoot) — 오버레이 스플래시 항상 사용
'use client';

import AuthCtas from '@/components/onboarding/AuthCtas';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';
import { tokenStore } from '@/lib/tokenStore';
import * as auth from '@/services/auth.api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const MIN_OVERLAY_MS = 800; // 오버레이 최소 노출 시간

export default function WelcomeAsRoot() {
  const router = useRouter();

  // 항상 오버레이를 사용: PWA든 브라우저든 첫 렌더부터 가림
  const [booting, setBooting] = useState(true);
  const startedAt = useRef<number>(Date.now());
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 이미 메모리에 AT가 있으면 홈으로
      if (tokenStore.get()) {
        if (!cancelled) await go('/home');
        return;
      }
      // 조용히 재발급 시도
      const ok = await auth.reissueToken().catch(() => false);

      if (cancelled) return;

      if (ok && tokenStore.get()) {
        await go('/home');
      } else {
        await finish(); // 실패: 웰컴 유지 + 오버레이 내림
      }
    })();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
    };
  }, [router]);

  async function finish() {
    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, MIN_OVERLAY_MS - elapsed);
    await new Promise<void>((r) => {
      const id = window.setTimeout(() => r(), wait);
      timers.current.push(id);
    });
    setBooting(false);
  }

  async function go(path: string) {
    await finish();     // 최소 노출 시간을 지키고
    router.replace(path);
  }

  return (
    <main className="relative mx-auto flex h-dvh max-w-[420px] flex-col">
      {/* 오버레이 스플래시: 항상 사용 (PWA에선 네이티브 스플래시 뒤에 연속 노출) */}
      {booting && (
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

      {/* 웰컴 실제 화면 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-onboarding-gradient" />
      <div className="relative z-10 flex-1 pt-6">
        <OnboardingSlider />
      </div>
      <div className="relative z-10 px-4 pb-[calc(env(safe-area-inset-bottom)+50px)]">
        <AuthCtas />
      </div>
    </main>
  );
}