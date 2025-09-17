// src/components/calendar/MonthSlider.tsx
'use client';

import { addMonths } from '@/lib/calendar';
import type { EventItem } from '@/types/calendar';
import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useMemo } from 'react';
import MonthGrid from './MonthGrid';

type Props = {
  base: Date;
  setBase: (d: Date | ((prev: Date) => Date)) => void;
  makeByDate: (monthBase: Date) => Map<string, EventItem[]>; // ✅ 바뀐 부분
  onPickDay: (d: Date) => void;
  className?: string;
};

export default function MonthSlider({
  base,
  setBase,
  makeByDate,
  onPickDay,
  className,
}: Props) {
  const slides = useMemo(
    () => [addMonths(base, -1), base, addMonths(base, 1)],
    [base],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: false,
  });

  const recenter = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(1, true);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    recenter();

    const onSettle = () => {
      const idx = emblaApi.selectedScrollSnap();
      if (idx === 0) setBase((prev) => addMonths(prev, -1));
      if (idx === 2) setBase((prev) => addMonths(prev, +1));
    };

    emblaApi.on('settle', onSettle);
    emblaApi.on('reInit', recenter);
    emblaApi.on('resize', recenter);
    return () => {
      emblaApi.off('settle', onSettle);
      emblaApi.off('reInit', recenter);
      emblaApi.off('resize', recenter);
    };
  }, [emblaApi, recenter, setBase]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = requestAnimationFrame(recenter);
    return () => cancelAnimationFrame(id);
  }, [slides, emblaApi, recenter]);

  // ✅ 각 슬라이드(monthBase)별로 “그 달 전용” 맵을 만든다
  const maps = useMemo(
    () => slides.map((d) => makeByDate(d)),
    [slides, makeByDate],
  );

  return (
    <div className={clsx('overflow-hidden', className)} ref={emblaRef}>
      <div className="flex">
        {slides.map((monthBase, i) => (
          <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
            <MonthGrid
              monthBase={monthBase}
              byDate={maps[i]}
              onPickDay={onPickDay}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
