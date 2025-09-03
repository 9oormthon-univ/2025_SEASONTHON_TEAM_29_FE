// app/WelcomeClient.tsx
'use client';

import AuthCtas from '@/components/onboarding/AuthCtas';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';

export default function WelcomeClient() {
  return (
    <main
      className="
        relative mx-auto flex max-w-[420px] flex-col
        h-[100svh] overflow-hidden overscroll-none touch-none
      "
    >
      {/* 배경 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-onboarding-gradient" />

      {/* 콘텐츠 */}
      <div className="relative z-10 flex-1 pt-6">
        {/* 슬라이더에만 터치 허용 */}
        <div className="touch-pan-y">
          <OnboardingSlider />
        </div>
      </div>

      <div className="relative z-10 px-4 pb-[calc(env(safe-area-inset-bottom)+50px)]">
        <AuthCtas />
      </div>
    </main>
  );
}