// src/components/calendar/MonthGrid.tsx
'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import { daysMatrix5, toYMD } from '@/lib/calendar';
import type { EventItem } from '@/types/calendar';
import clsx from 'clsx';
import Image from 'next/image';

type Props = {
  monthBase: Date;
  byDate: Map<string, EventItem[]>;
  onPickDay: (date: Date) => void;
};

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

export default function MonthGrid({ monthBase, byDate, onPickDay }: Props) {
  const cells = daysMatrix5(monthBase);

  return (
    <div className="grid grid-cols-7 gap-[9px]">
      {WEEK_LABELS.map((w, idx) => (
        <div key={w} className="flex justify-center">
          <div
            className={clsx(
              'w-10 h-7 flex items-center justify-center text-[11px] font-medium leading-none',
              idx === 0 ? 'text-[#E32727]' : 'text-text--secondary',
            )}
          >
            {w}
          </div>
        </div>
      ))}

      {cells.map((cell, i) => {
        const ymd = toYMD(cell);
        const isPrevNext = cell.getMonth() !== monthBase.getMonth();
        const widx = i % 7;
        const isSun = widx === 0;
        const events = byDate.get(ymd) ?? [];

        const primary = events.length
          ? events.reduce((best, cur) => {
              const nb = parseInt(String(best.id).replace(/\D/g, ''), 10) || 0;
              const nc = parseInt(String(cur.id).replace(/\D/g, ''), 10) || 0;
              return nc > nb ? cur : best;
            })
          : null;

        return (
          <div key={i} className="flex justify-center">
            <div className="w-10 flex flex-col items-center overflow-hidden">
              <div
                className={clsx(
                  'h-7 w-full flex items-center justify-center text-center',
                  'text-xs font-medium leading-none',
                  isPrevNext && 'opacity-40',
                  isSun ? 'text-[#E32727]' : 'text-text--default',
                )}
              >
                {cell.getDate()}
              </div>

              {primary ? (
                <button
                  type="button"
                  onClick={() => onPickDay(cell)}
                  aria-label={`${cell.getMonth() + 1}월 ${cell.getDate()}일`}
                  className="relative mt-[3px] w-10 h-10 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60 active:scale-95"
                >
                  {STICKER_SRC[primary.sticker] ? (
                    <Image
                      src={STICKER_SRC[primary.sticker]}
                      alt={primary.sticker}
                      width={40}
                      height={40}
                      draggable={false}
                      className="block w-10 h-10 object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded" />
                  )}
                  {events.length > 1 && (
                    <span className="absolute right-0.5 top-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                      +{events.length - 1}
                    </span>
                  )}
                </button>
              ) : (
                <div className="relative mt-[9px] w-10 h-10">
                  <div
                    className={clsx(
                      'w-10 h-10 rounded',
                      isPrevNext
                        ? 'opacity-20 border border-text-secondary'
                        : 'opacity-30 bg-box-line',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => onPickDay(cell)}
                    aria-label={`${cell.getMonth() + 1}월 ${cell.getDate()}일`}
                    className="absolute inset-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60 active:scale-95"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
