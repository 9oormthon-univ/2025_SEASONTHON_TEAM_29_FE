'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/common/monocules/Header';
import Button from '@/components/common/atomic/Button';
import { cn } from '@/utills/cn';
function SegmentedProgress({
  step,
  total = 3,
  className,
}: {
  step: number;
  total?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(step, total));
  const pct = (clamped / total) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={clamped}
      className={cn(
        'relative h-1 w-80 rounded-full bg-zinc-300 overflow-hidden',
        className,
      )}
    >
      <div
        className="absolute inset-y-0 left-0 bg-primary-500 transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function UploadCompositeFrame({
  value,
  onChange,
  className,
}: {
  value?: File | null;
  onChange: (f: File | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!value) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file ?? null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          'relative w-85 h-70 border border-box-line bg-zinc-200 cursor-pointer overflow-hidden',
          className,
        )}
        aria-label="메인 사진 업로드 프레임"
      >
        {objectUrl && (
          <Image
            src={objectUrl}
            alt="uploaded"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        <div className="mt-24 absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/LoveWinsAll.svg"
            alt="Love Wins All"
            className="w-48 h-auto opacity-90"
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-text--secondary">
        프레임을 클릭하면 사진을 넣을 수 있어요.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}

export default function InvitationStep1Page() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!file) {
      alert('메인 사진을 업로드해 주세요.');
      return;
    }
    alert('업로드 완료! (다음 단계로 이동 로직 연결하세요)');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header value="청첩장 제작" showBack>
        <div className="px-4">
          <SegmentedProgress step={1} className="mx-auto mt-[-2px]" />
        </div>
      </Header>

      <main className="px-6 pt-6">
        <p className="text-sm font-medium text-text--default">
          우리 청첩장의 얼굴이 될 사진이에요
        </p>
        <h2 className="mt-1 text-xl font-bold text-text--default pb-25">
          메인사진을 담아주세요.
        </h2>

        <div className="mt-8 flex flex-col items-center">
          <UploadCompositeFrame value={file} onChange={setFile} />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 px-6 pb-20 pt-4 bg-white/80 backdrop-blur">
        <Button fullWidth onClick={handleSubmit}>
          등록하기
        </Button>
      </div>
    </div>
  );
}
