'use client';

import { useSignupWizard } from '@/hooks/useSignupWizard';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/atomic/Button';
import ProgressBar from '../common/atomic/ProgressBar';
import StepBasic from './steps/StepBasic';
import StepExtra from './steps/StepExtra';
import StepTerms from './steps/StepTerms';

export default function SignupWizard() {
  const router = useRouter();
  const [emblaRef, embla] = useEmblaCarousel({ loop:false, align:'start', watchDrag: false });
  const [index, setIndex] = useState(0);
  const wiz = useSignupWizard();

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setIndex(embla.selectedScrollSnap());
    onSel(); embla.on('select', onSel);
  }, [embla]);

  const prev = () => index > 0 && embla?.scrollTo(index - 1);
  const next = () => index < 2 && embla?.scrollTo(index + 1);

  const onSignUp = () => {
    router.push('/home');
  }


  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 bg-white/70 backdrop-blur px-4">
        <div className="relative mx-auto flex h-16 max-w-[420px] items-center justify-center">
          <button aria-label="back" onClick={prev} className="absolute left-0 disabled:opacity-40" disabled={index===0}>
            <ChevronLeft className="h-7 w-7" />
          </button>
          <h1 className="text-md font-medium">회원가입</h1>
        </div>
        <ProgressBar
          value={index + 1} 
          max={3} 
          size='xs'
          className="w-full" 
        />
      </header>

      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <StepTerms {...wiz} />
          <StepBasic {...wiz} />
          <StepExtra {...wiz} />
        </div>
      </div>

      <div className="sticky bottom-0 px-4 bg-white/70 pb-[calc(env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        {index < 2 ? (
          <Button
            size="md"
            fullWidth
            disabled={(index === 0 && !wiz.canNextTerms) || (index === 1 && !wiz.canNextBasic)}
            onClick={next}
            className="h-12 text-sm"
          >
            다음
          </Button>
        ) : (
          <Button
            size="md"
            fullWidth
            disabled={!wiz.canSubmitExtra}
            onClick={onSignUp}
            className="h-12 text-sm"
          >
            웨딧 시작하기
          </Button>
        )}
      </div>
    </div>
  );
}