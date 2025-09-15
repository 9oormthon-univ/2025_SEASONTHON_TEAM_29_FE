'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Header from '@/components/common/monocules/Header';
import LineStepProgress from '@/components/invitation/LineStepProgress';
import Step1 from '@/components/invitation/ThemaStep/Step1';
import Step2 from '@/components/invitation/ThemaStep/Step2';
import Step3 from '@/components/invitation/ThemaStep/Step3';

export default function ThemaEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sp = useSearchParams();

  const step = useMemo(() => {
    const n = Number(sp.get('step') ?? '1');
    return Number.isFinite(n) ? Math.min(Math.max(1, n), 3) : 1;
  }, [sp]);
  const [FirstPhoto, setFirstPhoto] = useState<File | null>(null);
  const [SecondPhotos, setSecondPhotos] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [ThirdPhoto, setThirdPhoto] = useState<File | null>(null);
  const setSubAt = (i: number, f: File | null) =>
    setSecondPhotos((prev) => prev.map((v, idx) => (idx === i ? f : v)));
  const pushStep = (n: number) =>
    router.push(`/mypage/invite/editor/thema/${params.id}?step=${n}`);

  const handleBack = () => {
    if (step > 1) pushStep(step - 1);
    else router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header value="청첩장 제작" showBack onBack={handleBack}>
        <div className="px-4">
          <LineStepProgress
            step={step}
            total={3}
            className="mx-auto mt-[-2px]"
          />
        </div>
      </Header>

      {step === 1 && (
        <Step1
          file={FirstPhoto}
          onChangeFile={setFirstPhoto}
          onNext={() => {
            if (!FirstPhoto) return;
            pushStep(2);
          }}
        />
      )}

      {step === 2 && (
        <Step2
          files={SecondPhotos}
          onChangeAt={setSubAt}
          onNext={() => {
            if (!SecondPhotos) return;
            pushStep(3);
          }}
        />
      )}

      {step === 3 && (
        <Step3
          files={ThirdPhoto}
          onChangeFile={setThirdPhoto}
          onNext={() => {
            if (!ThirdPhoto) return;
            pushStep(2);
          }}
        />
      )}
    </div>
  );
}
