'use client';

import * as React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import { tokenStore } from '@/lib/tokenStore';

function TimeChip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'h-14 w-full rounded-[100px] px-6 text-sm font-medium inline-flex items-center justify-center',
        'outline outline-offset-[-1px] transition-opacity',
        selected
          ? 'bg-primary-200 outline-2 outline-primary-300'
          : 'outline-1 outline-box-line',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {label}
    </button>
  );
}

type TimeSlot = {
  time: string;
  timeDisplay: string;
  reservationId: number;
  available: boolean;
};

type ApiResponseTimeSlots = {
  status: number;
  success: boolean;
  message: string;
  data: { timeSlots: TimeSlot[] } | null;
};

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : '시간 조회 실패';
const ensureHMS = (t: string) => (t.length === 5 ? `${t}:00` : t);

export default function ConsultTimePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const vendorIdStr = sp.get('vendorId');
  const vendorId =
    vendorIdStr !== null && !Number.isNaN(Number(vendorIdStr))
      ? Number(vendorIdStr)
      : null;

  const rawDate = sp.get('date') ?? new Date().toISOString().slice(0, 10);
  const [yy, mm, dd] = rawDate.split('-').map(Number);

  const [slots, setSlots] = React.useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<null | 'book' | 'estimate'>(null);

  React.useEffect(() => {
    setSelectedTime(null);
  }, [rawDate]);

  React.useEffect(() => {
    if (!API_BASE) return;
    if (vendorId === null) {
      setError('유효한 vendorId가 없습니다.');
      return;
    }
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = tokenStore.get();
        const url = `${API_BASE}/v1/reservation/${vendorId}/detail?year=${yy}&month=${mm}&day=${dd}`;
        const res = await fetch(url, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponseTimeSlots;
        setSlots(json.data?.timeSlots ?? []);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [API_BASE, vendorId, yy, mm, dd]);

  React.useEffect(() => {
    if (!sheet) return;
    const t = setTimeout(() => router.push('/home'), 5000);
    return () => clearTimeout(t);
  }, [sheet, router]);

  const handleReserve = async () => {
    if (!selectedTime || !API_BASE || vendorId === null) return;
    try {
      setPosting(true);
      setError(null);
      const token = tokenStore.get();
      const url = `${API_BASE}/v1/reservation/${vendorId}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ date: rawDate, time: ensureHMS(selectedTime) }),
      });
      if (!res.ok) throw new Error(`예약 실패 (HTTP ${res.status})`);
      setSheet('book');
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setPosting(false);
    }
  };
  const handleAddToEstimate = async () => {
    if (!selectedTime || !API_BASE || vendorId === null) return;
    try {
      setAdding(true);
      setError(null);
      const token = tokenStore.get();
      const url = `${API_BASE}/v1/estimate/${vendorId}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ date: rawDate, time: ensureHMS(selectedTime) }),
      });
      if (!res.ok) throw new Error(`견적 담기 실패 (HTTP ${res.status})`);
      setSheet('estimate');
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setAdding(false);
    }
  };

  return (
    <ReservationLayout
      title="예약하기"
      step={3}
      headline="시간을 선택해 주세요."
      mode="double"
      leftText={posting ? '예약 중...' : '예약하기'}
      rightText={adding ? '담는 중…' : '견적서 담기'}
      onLeft={handleReserve}
      onRight={handleAddToEstimate}
      activeLeft={!!selectedTime && !posting && vendorId !== null}
      activeRight={!!selectedTime && !adding && vendorId !== null}
    >
      {loading && (
        <div className="text-sm text-text--secondary">시간을 불러오는 중…</div>
      )}
      {error && <div className="text-sm text-red-500">오류: {error}</div>}

      <div className="grid grid-cols-3 gap-4">
        {slots.map((s) => (
          <TimeChip
            key={`${s.time}-${s.reservationId}`}
            label={s.timeDisplay || s.time}
            selected={selectedTime === s.time}
            disabled={!s.available}
            onClick={() => setSelectedTime(s.time)}
          />
        ))}
      </div>

      {sheet && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60]">
          <button
            aria-label="닫기"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setSheet(null)}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[420px] h-96 bg-white rounded-t-xl overflow-hidden">
            <div className="w-11 h-0.5 mx-auto mt-3 rounded-full bg-neutral-300" />
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <Image
                src={sheet === 'book' ? '/congratu.png' : '/cartCheck.png'}
                alt={
                  sheet === 'book'
                    ? '예약이 완료 되었어요!'
                    : '견적서에 잘 담았어요!'
                }
                width={160}
                height={160}
                priority
                className="w-[160px] h-[160px] select-none pointer-events-none"
              />
              <p className="text-[16px] font-semibold text-text--default">
                {sheet === 'book'
                  ? '예약이 완료 되었어요!'
                  : '견적서에 잘 담았어요!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </ReservationLayout>
  );
}
