// components/tours/fitting/Preview.tsx
'use client';
import type { FitAdjust } from '@/types/dress';
import Image from 'next/image';

type XY = { x: number; y: number };
type Box = { scale: number; offset: XY; origin: string };

function normFit(f?: FitAdjust): Box {
  return {
    scale: f?.scale ?? 1,
    offset: { x: f?.offset?.x ?? 0, y: f?.offset?.y ?? 0 },
    origin: f?.origin ?? '50% 50%',
  };
}

type Props = {
  neckOverlay?: string | null;
  neckFit?: FitAdjust | null;    // ← 추가
  lineOverlay?: string | null;
  lineFit?: FitAdjust | null;    // ← 추가
  canvasRatioPct?: number;       // 배경 세로 비율
};

export default function Preview({
  neckOverlay,
  neckFit,
  lineOverlay,
  lineFit,
  canvasRatioPct = 72,
}: Props) {
  const neck = normFit(neckFit ?? undefined);
  const line = normFit(lineFit ?? undefined);

  return (
    <section className="relative overflow-hidden bg-primary-200">
      <div className="relative w-full" style={{ paddingTop: `${canvasRatioPct}%` }}>
        {/* 배경 */}
        <Image
          src="/fitting/fittingBg.png"
          alt=""
          fill
          priority
          draggable={false}
          className="select-none object-cover"
        />
        {/* 마네킹 (센터 고정) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/fitting/mannequin.svg"
            alt=""
            fill
            draggable={false}
            className="pointer-events-none select-none object-contain"
            style={{ transform: 'scale(0.6)' }} // ← 0.9 = 90% 크기
          />
        </div>
        {/* 하의 */}
        {lineOverlay && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: `translate(${line.offset.x}%, ${line.offset.y}%)` }}
          >
            <Image
              src={lineOverlay}
              alt=""
              fill
              draggable={false}
              className="select-none"
              style={{
                objectFit: 'contain',
                transform: `scale(${line.scale})`,
                transformOrigin: line.origin,
              }}
            />
          </div>
        )}
        {/* 상의 */}
        {neckOverlay && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ transform: `translate(${neck.offset.x}%, ${neck.offset.y}%)` }}
          >
            <Image
              src={neckOverlay}
              alt=""
              fill
              draggable={false}
              className="select-none"
              style={{
                objectFit: 'contain',
                transform: `scale(${neck.scale})`,
                transformOrigin: neck.origin,
              }}
            />
          </div>
        )}
        
      </div>
    </section>
  );
}