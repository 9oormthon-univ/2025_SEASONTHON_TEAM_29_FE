// src/components/calendar/MonthGrid.tsx
'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import { daysMatrix5, toYMD } from '@/lib/calendar';
import type { EventItem } from '@/types/calendar';
import clsx from 'clsx';

type Props = {
  monthBase: Date;
  byDate: Map<string, EventItem[]>;
  onPickDay: (date: Date) => void;
};

export default function MonthGrid({ monthBase, byDate, onPickDay }: Props) {
  const cells = daysMatrix5(monthBase);

  return (
    <ul className="grid grid-cols-7 gap-[4px]">
      {cells.map((cell, i) => {
        const ymd = toYMD(cell);
        const isPrevNext = cell.getMonth() !== monthBase.getMonth();
        const widx = i % 7;
        const isSun = widx === 0;
        const events = byDate.get(ymd) ?? [];

        // 가장 id 큰거 고르기
        const primary = events.length
          ? events.reduce((best, cur) => {
              const nb = parseInt(String(best.id).replace(/\D/g, ''), 10) || 0;
              const nc = parseInt(String(cur.id).replace(/\D/g, ''), 10) || 0;
              return nc > nb ? cur : best;
            })
          : null;

        return (
          <li key={i} className="flex justify-center">
            <div className="relative h-[55px] w-9 overflow-hidden">
              <div
                className={clsx(
                  'absolute left-[12px] text-xs font-medium leading-normal',
                  isPrevNext ? 'opacity-40 text-text--default' : 'text-text--default',
                  !isPrevNext && isSun && 'text-[#FF6B6B]'
                )}
              >
                {cell.getDate()}
              </div>

              {primary ? (
                <button
                  type="button"
                  onClick={() => onPickDay(cell)}
                  aria-label={`${cell.getMonth() + 1}월 ${cell.getDate()}일`}
                  className="absolute left-0 top-[18px] h-9 w-9 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60 active:scale-95"
                >
                  <img
                    src={STICKER_SRC[primary.sticker]}
                    alt=""
                    width={36}
                    height={36}
                    draggable={false}
                    className="block h-9 w-9 object-contain"
                  />
                  {events.length > 1 && (
                    <span className="absolute right-0.5 top-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                      +{events.length - 1}
                    </span>
                  )}
                </button>
              ) : (
                <>
                  <div
                    className={clsx(
                      'absolute left-0 top-[18px] h-9 w-9 rounded',
                      isPrevNext ? 'opacity-20 border border-text-secondary' : 'opacity-30 bg-box-line'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => onPickDay(cell)}
                    aria-label={`${cell.getMonth() + 1}월 ${cell.getDate()}일`}
                    className="absolute left-0 top-[18px] h-9 w-9 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60 active:scale-95"
                  />
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}