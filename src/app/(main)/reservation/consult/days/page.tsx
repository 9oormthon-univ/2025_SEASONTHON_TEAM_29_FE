'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import CalendarDay from '@/components/Calandar/CalendarDay';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const mondayFirst = (jsDay: number) => (jsDay + 6) % 7;

function getYearMonth(sp: ReturnType<typeof useSearchParams>) {
  const now = new Date();
  const raw =
    sp.get('ym') ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [y, m] = raw.split('-').map(Number);
  const year = Number.isFinite(y) ? y : now.getFullYear();
  const month1 = Number.isFinite(m) ? m : now.getMonth() + 1;
  return {
    year,
    monthIdx: month1 - 1,
    label: `${year}.${String(month1).padStart(2, '0')}`,
  };
}

export default function ConsultDaysPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const { year, monthIdx, label } = getYearMonth(sp);

  const first = new Date(year, monthIdx, 1);
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const startIdx = mondayFirst(first.getDay());
  const cells: (number | null)[] = [
    ...Array.from({ length: startIdx }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const AVAILABLE = new Set([
    3, 5, 7, 8, 12, 15, 16, 18, 22, 23, 24, 25, 26, 27, 29, 30,
  ]);

  const handleClick = (d: number, available: boolean) => {
    if (!available) return;
    setSelectedDay(d);
  };

  return (
    <ReservationLayout
      title="예약하기"
      step={2}
      headline={
        <>
          상담 받고싶은 날짜를 <br />
          선택해 주세요.
        </>
      }
      mode="single"
      primaryText="다음"
      active={!!selectedDay}
      onPrimary={() => {
        if (!selectedDay) return;
        router.push(
          `/reservation/consult/select?date=${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(
            selectedDay,
          ).padStart(2, '0')}`,
        );
      }}
    >
      <div className="mb-2 text-base font-medium text-text--default">
        {label}
      </div>
      <div className="grid grid-cols-7 gap-3 mb-2">
        {weekdayLabels.map((w) => (
          <div key={w} className="text-center text-sm text-text-secondary">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {cells.map((d, idx) => {
          if (d === null)
            return <div key={`empty-${idx}`} className="w-10 h-10" />;

          const isAvailable = AVAILABLE.has(d);
          const isSelected = selectedDay === d;
          const dimOthers = selectedDay !== null && !isSelected;

          return (
            <div key={d} className="flex justify-center">
              <CalendarDay
                className={dimOthers ? 'opacity-40' : undefined}
                day={
                  <span
                    className={
                      isSelected
                        ? 'text-red-500'
                        : idx % 7 === 6
                          ? 'text-red-500'
                          : ''
                    }
                  >
                    {d}
                  </span>
                }
                type={
                  isSelected ? 'selected' : isAvailable ? 'green' : 'variant2'
                }
                onClick={() => handleClick(d, isAvailable)}
              />
            </div>
          );
        })}
      </div>
    </ReservationLayout>
  );
}
