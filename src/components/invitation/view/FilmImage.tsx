'use client';

import Image from 'next/image';
import { cn } from '@/utills/cn';

type Props = {
  photos: [string | null, string | null, string | null];
  className?: string;
  insetX?: number;
  insetY?: number;
  gapPx?: number;
  offset2?: number;
  offset3?: number;
};
const SLOT_W = 170;
const SLOT_H = 110;

function StaticSlot({
  src,
  ariaLabel,
}: {
  src?: string | null;
  ariaLabel: string;
}) {
  return (
    <div
      aria-label={ariaLabel}
      className="relative overflow-hidden bg-neutral-500"
      style={{ width: SLOT_W, height: SLOT_H }}
    >
      {src && (
        <Image
          src={src}
          alt="film image"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      )}
    </div>
  );
}

export default function FilmImage({
  photos,
  className,
  insetX = 30.5,
  insetY = 32,
  gapPx = 16,
  offset2 = 11.5,
  offset3 = 22,
}: Props) {
  const [left, center, right] = photos;

  const rowWidth = SLOT_W * 3 + gapPx * 2;
  const rowHeight = SLOT_H;

  return (
    <div className={cn('px-6 pt-6', className)}>
      <div
        className="relative mt-10"
        style={{
          width: rowWidth + insetX * 2,
          height: rowHeight + insetY * 2,
          margin: '0 auto',
        }}
      >
        <div
          className="absolute z-10 flex items-center justify-between"
          style={{
            left: insetX,
            top: insetY,
            width: rowWidth,
            height: rowHeight,
            gap: gapPx,
          }}
        >
          <StaticSlot src={left} ariaLabel="왼쪽 사진" />
          <div style={{ transform: `translateX(${offset2}px)` }}>
            <StaticSlot src={center} ariaLabel="가운데 사진" />
          </div>
          <div style={{ transform: `translateX(${offset3}px)` }}>
            <StaticSlot src={right} ariaLabel="오른쪽 사진" />
          </div>
        </div>
        <Image
          src="/film.svg"
          alt="film frame"
          fill
          priority
          className="absolute z-20 pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
