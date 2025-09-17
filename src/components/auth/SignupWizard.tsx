'use client';

import { useSignupWizard } from '@/hooks/useSignupWizard';
import useEmblaCarousel from 'embla-carousel-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/atomic/Button';
import ProgressBar from '../common/atomic/ProgressBar';
import StepBasic from './steps/StepBasic';
import StepExtra from './steps/StepExtra';
import StepTerms from './steps/StepTerms';
import Header from '../common/monocules/Header';

export default function SignupWizard() {
  const router = useRouter();
  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: 'start',
    watchDrag: false,
  });
  const [index, setIndex] = useState(0);
  const wiz = useSignupWizard();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setIndex(embla.selectedScrollSnap());
    onSel();
    embla.on('select', onSel);
  }, [embla]);

  const prev = () => {
    if (index > 0) {
      embla?.scrollTo(index - 1);
    } else {
      if (window.history.length > 1) router.back();
      else router.replace('/');
    }
  };
  const next = () => index < 2 && embla?.scrollTo(index + 1);

  const onSignUp = async () => {
    setLoading(true);
    setErr(null);
    try {
      await wiz.submitSignup();
      router.replace('/login');
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : '회원가입에 실패했어요. 다시 시도해주세요.';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header
        value="회원가입"
        showBack
        onBack={prev}
        bgClassName="bg-white/70"
        textClassName="text-text--default"
      >
        <ProgressBar value={index + 1} max={3} size="xs" className="w-full" />
      </Header>

      <div className="flex-1 overflow-hidden mx-5.5" ref={emblaRef}>
        <div className="flex">
          <StepTerms {...wiz} />
          <StepBasic {...wiz} />
          <StepExtra {...wiz} />
        </div>
      </div>

      <div className="sticky bottom-0 px-4 bg-white/70 pb-[calc(env(safe-area-inset-bottom))] pt-3 mb-20 backdrop-blur">
        {index < 2 ? (
          <Button
            size="md"
            fullWidth
            disabled={
              (index === 0 && !wiz.canNextTerms) ||
              (index === 1 && !wiz.canNextBasic)
            }
            onClick={next}
            className="h-13 text-sm"
          >
            다음
          </Button>
        ) : (
          <Button
            size="lg"
            fullWidth
            disabled={!wiz.canSubmitExtra || loading}
            onClick={onSignUp}
            className="h-13 text-sm"
          >
            {loading ? '가입 중…' : '웨딧 시작하기'}
          </Button>
        )}
        {err && <p className="mt-2 text-center text-sm text-red-500">{err}</p>}
      </div>
    </div>
  );
}
