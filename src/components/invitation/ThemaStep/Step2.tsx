'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/atomic/Button';
import { cn } from '@/utills/cn';

type SlotProps = {
  file: File | null;
  onChange: (f: File | null) => void;
  ariaLabel?: string;
};
function PhotoSlot({ file, onChange, ariaLabel }: SlotProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return setUrl(null);
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        aria-label={ariaLabel}
        className={cn(
          'relative w-full h-full bg-neutral-500 rounded-[10px] cursor-pointer',
          'overflow-visible',
        )}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-full">
          {url && <Image src={url} alt="uploaded" fill priority unoptimized />}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </>
  );
}

export default function Step2({
  files,
  onChangeAt,
  onNext,
}: {
  files: (File | null)[];
  onChangeAt: (index: number, f: File | null) => void;
  onNext: () => void;
}) {
  const allSelected = files.every(Boolean);

  const WIDTH_VW = 160;
  const CTR_FR = 1.3;
  const INSET_X = '6.5%';
  const INSET_Y = '18%';
  const GAP_PCT = '5.0%';

  return (
    <div className="px-6 pt-6">
      <p className="text-sm font-medium text-text--default">
        추억이 깃든 사진이 필요해요
      </p>
      <h2 className="mt-1 text-xl font-bold text-text--default pb-40">
        사진 3장을 담아주세요.
      </h2>
      <div
        className="relative mt-10 h-56 overflow-visible"
        style={{
          width: `${WIDTH_VW}vw`,
          left: '50%',
          transform: 'translateX(-50%) translateY(-30%)',
          position: 'relative',
        }}
      >
        <div
          className="bg-neutral-500 absolute z-10 grid overflow-visible"
          style={{
            gridTemplateColumns: `1fr ${CTR_FR}fr 1fr`,
            left: INSET_X,
            right: INSET_X,
            top: INSET_Y,
            bottom: INSET_Y,
            columnGap: GAP_PCT,
          }}
        >
          <div
            style={{
              marginLeft: `30px`,
              marginRight: `0px`,
            }}
          >
            <PhotoSlot
              file={files[0]}
              onChange={(f) => onChangeAt(0, f)}
              ariaLabel="왼쪽 사진 업로드"
            />
          </div>
          <div
            style={{
              marginLeft: `30px`,
              marginRight: `12px`,
            }}
          >
            <PhotoSlot
              file={files[1]}
              onChange={(f) => onChangeAt(1, f)}
              ariaLabel="가운데 사진 업로드"
            />
          </div>
          <div
            style={{
              marginLeft: `10px`,
              marginRight: `0px`,
            }}
          >
            <PhotoSlot
              file={files[2]}
              onChange={(f) => onChangeAt(2, f)}
              ariaLabel="오른쪽 사진 업로드"
            />
          </div>
        </div>
        <Image
          src="/film.svg"
          alt="film frame"
          fill
          priority
          className="absolute z-20 pointer-events-none select-none"
          sizes="100vw"
        />
      </div>
      <p className="-mt-10 text-xs text-text--secondary text-center">
        프레임을 클릭하면 사진을 넣을 수 있어요.
      </p>
      <div className="fixed inset-x-0 bottom-0 px-6 pb-20 pt-4 bg-white/80 backdrop-blur">
        <Button fullWidth onClick={onNext} disabled={!allSelected}>
          등록하기
        </Button>
      </div>
    </div>
  );
}
