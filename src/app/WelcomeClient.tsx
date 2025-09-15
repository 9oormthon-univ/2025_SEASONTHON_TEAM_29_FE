'use client';

import { useEffect, useState } from 'react';
import AuthCtas from '@/components/onboarding/AuthCtas';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';
import clsx from 'clsx';
function useCompactVH(breakpoint = 740) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const sync = () => setCompact(window.innerHeight < breakpoint);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [breakpoint]);
  return compact;
}

export default function WelcomeClient() {
  const compact = useCompactVH(740);

  return (
    <main
      className="
        relative mx-auto flex max-w-[420px] flex-col
        h-[100svh] overflow-hidden overscroll-none touch-none
      "
    >
      {/* 배경 */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0
          bg-gradient-to-bl from-[#FFC6C9] to-[#FFFFFF]
        "
      />

      {/* 콘텐츠 */}
      <div
        className={clsx(
          'relative z-10 flex flex-col flex-1',
          compact ? 'pt-3' : 'pt-13',
        )}
      >
        <div
          className={clsx(
            'touch-pan-y transition-transform',
            compact ? 'scale-[0.94] origin-top' : 'scale-100',
          )}
        >
          <OnboardingSlider />
        </div>

        <div
          className={clsx(
            'px-4 transition-all',
            compact
              ? 'mt-2 pb-[calc(env(safe-area-inset-bottom)+10px)]'
              : 'mt-6 pb-[calc(env(safe-area-inset-bottom)+28px)]',
          )}
        >
          <AuthCtas />
        </div>
      </div>
    </main>
  );
}
