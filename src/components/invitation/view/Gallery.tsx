'use client';

import Image from 'next/image';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';

type Props = {
  images: string[];
  perPage?: number;
  total?: number;
  className?: string;
  showHint?: boolean;
};

export default function Gallery({
  images,
  perPage = 9,
  total = 27,
  className,
  showHint = true,
}: Props) {
  const pagesCount = Math.ceil(total / perPage);
  const pageIndexes = useMemo(
    () => Array.from({ length: pagesCount }, (_, i) => i),
    [pagesCount],
  );
  const urls = useMemo(
    () => Array.from({ length: total }, (_, i) => images[i] ?? null),
    [images, total],
  );
  const staggeredIndices = (start: number, count = 9, pageIndex: number) => {
    const ids = Array.from({ length: count }, (_, idx) => start + idx);
    const [a, b, c, d, e, f, g, h, i] = ids as number[];

    // 왼-오-왼
    const patternA = [a, b, c, null, null, d, e, f, g, h, i, null];
    // 오-왼-오
    const patternB = [null, a, b, c, d, e, f, null, null, g, h, i];

    return (pageIndex % 2 === 0 ? patternA : patternB).slice(0, 12) as Array<
      number | null
    >;
  };

  return (
    <section className={clsx('mx-auto w-full max-w-[420px]', className)}>
      <div className="flex items-center justify-center">
        <SvgObject
          src="/Gallery.svg"
          alt="Gallery"
          width={140}
          height={72}
          className="h-auto w-[140px] select-none"
        />
      </div>
      <div className="mt-6">
        <div className="flex snap-x snap-mandatory overflow-x-auto scroll-pl-6 gap-6 px-6 pb-2">
          {pageIndexes.map((p) => {
            const start = p * perPage;
            const end = Math.min(start + perPage, total);
            const indices = staggeredIndices(start, end - start, p);

            return (
              <section
                key={p}
                className="snap-start shrink-0 w-[calc(100vw-48px)] max-w-[372px]"
                aria-label={`gallery-page-${p + 1}`}
              >
                <div className="grid grid-cols-4 gap-2">
                  {indices.map((idx, k) =>
                    idx === null ? (
                      <div key={`empty-${p}-${k}`} />
                    ) : (
                      <div key={idx} className="relative">
                        <div
                          className={clsx(
                            'relative w-full overflow-hidden',
                            'outline-1 outline-box-line bg-box-line',
                            'aspect-[3/4]',
                          )}
                        >
                          {!urls[idx] && (
                            <span className="absolute inset-0 grid place-items-center text-xl font-bold text-text--secondary">
                              {idx + 1}
                            </span>
                          )}
                          {urls[idx] && (
                            <Image
                              src={urls[idx]!}
                              alt={`${idx + 1}번 이미지`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 420px) 45vw, 372px"
                              priority={p === 0}
                              unoptimized
                            />
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {showHint && (
        <p
          className="mt-4 text-center text-xs leading-normal text-text--tertiary"
          style={{ fontFamily: 'DI, serif' }}
        >
          좌우로 넘기시면 더 많은 사진을 볼 수 있어요.
        </p>
      )}
    </section>
  );
}
