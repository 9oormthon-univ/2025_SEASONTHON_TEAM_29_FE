
import AuthCtas from '@/components/onboarding/AuthCtas';
import OnboardingSlider from '@/components/onboarding/OnboardingSlider';

export default function WelcomePage() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-[420px] flex-col">
      {/* 배경 레이어 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-onboarding-gradient" />

      {/* 콘텐츠 레이어 */}
      <div className="relative z-10 flex-1 pt-6">
        <OnboardingSlider />
      </div>

      <div className="relative z-10 px-4 pb-[calc(env(safe-area-inset-bottom)+50px)]">
        <AuthCtas />
      </div>
    </main>
  );
}