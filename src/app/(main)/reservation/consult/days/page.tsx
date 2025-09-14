'use client';

import CalendarDay from '@/components/Calandar/CalendarDay';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import { getMonthlyAvailability } from '@/services/reservation.api';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];
const mondayFirst = (jsDay: number) => (jsDay + 6) % 7;

function useYearMonth(sp: ReturnType<typeof useSearchParams>) {
  const now = new Date();
  const raw =
    sp.get('ym') ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [y, m] = raw.split('-').map(Number);
  const year = Number.isFinite(y) ? y : now.getFullYear();
  const month1 = Number.isFinite(m) ? m : now.getMonth() + 1;
  return {
    year,
    month1,
    monthIdx: month1 - 1,
    label: `${year}.${String(month1).padStart(2, '0')}`,
  };
}

export default function ConsultDaysPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const vendorId = sp.get('vendorId') ? Number(sp.get('vendorId')) : null;
  const { year, month1, monthIdx, label } = useYearMonth(sp);

  const first = new Date(year, monthIdx, 1);
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const startIdx = mondayFirst(first.getDay());
  const cells: (number | null)[] = [
    ...Array.from({ length: startIdx }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [availableDays, setAvailableDays] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 월별 예약 가능일 조회
  const loadDays = useCallback(async () => {
    if (!vendorId) return;
    try {
      setLoading(true);
      setError(null);
      const days = await getMonthlyAvailability({ vendorId, year, month: month1 });
      const set = new Set<number>();
      for (const item of days) {
        const [yy, mm, dd] = item.date.split('-').map(Number);
        if (yy === year && mm === month1 && item.available) {
          set.add(dd);
        }
      }
      setAvailableDays(set);
    } catch (e) {
      setError(e instanceof Error ? e.message : '날짜 조회 실패');
      setAvailableDays(new Set());
    } finally {
      setLoading(false);
    }
  }, [vendorId, year, month1]);

  useEffect(() => {
    void loadDays();
  }, [loadDays]);

  const handleNext = () => {
    if (!selectedDay || !vendorId) return;
    const date = `${year}-${String(month1).padStart(2, '0')}-${String(
      selectedDay,
    ).padStart(2, '0')}`;
    const qs = new URLSearchParams({ date, vendorId: String(vendorId) });
    router.push(`/reservation/consult/select?${qs.toString()}`);
  };

  return (
    <ReservationLayout
      title="예약하기"
      step={2}
      headline={
        <>
          상담 받고싶은 날짜를 <br />선택해 주세요.
        </>
      }
      mode="single"
      primaryText="다음"
      active={!!selectedDay}
      onPrimary={handleNext}
    >
      <div className="mb-2 text-base font-medium text-text--default">{label}</div>

      {loading && (
        <div className="mb-2 text-sm text-text--secondary">
          달력을 불러오는 중…
        </div>
      )}
      {error && <div className="mb-2 text-sm text-red-500">오류: {error}</div>}

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-3 mb-2">
        {weekdayLabels.map((w) => (
          <div key={w} className="text-center text-sm text-text-secondary">
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 셀 */}
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
                type={isSelected ? 'selected' : isAvailable ? 'green' : 'variant2'}
                onClick={() => isAvailable && setSelectedDay(d)}
              />
            </div>
          );
        })}
      </div>
    </ReservationLayout>
  );
}