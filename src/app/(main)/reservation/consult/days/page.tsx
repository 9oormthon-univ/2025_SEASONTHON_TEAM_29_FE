'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import CalendarDay from '@/components/Calandar/CalendarDay';
import { tokenStore } from '@/lib/tokenStore';
import type { ReservationDay } from '@/types/reservation';
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
type ApiResponseDays = {
  status: number;
  success: boolean;
  message: string;
  data: ReservationDay[];
};

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : '날짜 조회 실패';

export default function ConsultDaysPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const { year, monthIdx, label } = getYearMonth(sp);
  const month1 = monthIdx + 1;
  const vendorId = sp.get('vendorId');
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const first = new Date(year, monthIdx, 1);
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const startIdx = mondayFirst(first.getDay());
  const cells: (number | null)[] = [
    ...Array.from({ length: startIdx }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [availableDays, setAvailableDays] = React.useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    setSelectedDay(null);
    if (!API_BASE || vendorId == null) {
      console.warn('API_BASE 또는 vendorId가 없습니다.');
      return;
    }

    // useEffect 내부 fetchDays 교체
    const fetchDays = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = tokenStore.get();
        const url = `${API_BASE}/v1/reservation/${encodeURIComponent(
          String(vendorId),
        )}?year=${year}&month=${month1}`;

        const res = await fetch(url, {
          cache: 'no-store',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as ApiResponseDays;

        const set = new Set<number>();
        for (const item of json.data ?? []) {
          const [yy, mm, dd] = item.date.split('-').map(Number);
          if (yy === year && mm === month1 && item.available) set.add(dd);
        }
        setAvailableDays(set);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
        setAvailableDays(new Set<number>());
      } finally {
        setLoading(false);
      }
    };

    fetchDays();
  }, [API_BASE, vendorId, year, month1]);

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
        const date = `${year}-${String(month1).padStart(2, '0')}-${String(
          selectedDay,
        ).padStart(2, '0')}`;
        const qs = new URLSearchParams();
        qs.set('date', date);
        qs.set('vendorId', String(vendorId));
        router.push(`/reservation/consult/select?${qs.toString()}`);
      }}
    >
      <div className="mb-2 text-base font-medium text-text--default">
        {label}
      </div>

      {loading && (
        <div className="mb-2 text-sm text-text--secondary">
          달력을 불러오는 중…
        </div>
      )}
      {error && <div className="mb-2 text-sm text-red-500">오류: {error}</div>}

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

          const isAvailable = availableDays.has(d);
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
