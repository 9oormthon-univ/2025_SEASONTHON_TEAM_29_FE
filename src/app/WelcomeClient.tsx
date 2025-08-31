// app/WelcomeClient.tsx
'use client';

import AuthCtas from '@/components/onboarding/AuthCtas';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';

export default function WelcomeClient() {
  return (
    <main className="relative mx-auto flex h-dvh max-w-[420px] flex-col">
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