'use client';

import Image from 'next/image';
import { cn } from '@/utills/cn';

type Props = {
  src?: string;
  className?: string;
};

export default function MainImage({
  src = '/mock/main-sample.jpg',
  className,
}: Props) {
  return (
    <>
      <div
        className={cn(
          'relative w-85 h-70 border border-box-line bg-zinc-200 overflow-hidden',
          className,
        )}
        aria-label="메인 사진 프레임"
      >
        <Image
          src={src}
          alt="main"
          fill
          className="object-cover"
          priority
          unoptimized
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-30">
          <Image
            src="/LoveWinsAll.svg"
            alt="Love Wins All"
            width={192}
            height={192}
            className="w-48 h-auto opacity-90"
            priority
          />
        </div>
      </div>
      <div className="mt-2 justify-start text-text--secondary text-[10px] font-normal font-di leading-tight">
        *곧 저희들의 영화가 막을 올립니다. 즐거운 마음으로 관람해주시기
        바랍니다.*
      </div>
    </>
  );
}
