'use client';

import * as React from 'react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
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
      aria-disabled={disabled}
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

type DetailResp = {
  status: number;
  success: boolean;
  message: string;
  data: {
    date: string;
    timeSlots: TimeSlot[];
    totalSlots: number;
    availableSlots: number;
    reservedSlots: number;
  };
};

const VENDOR_ID = 3;

export default function ConsultTimePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const rawDate = sp.get('date') ?? new Date().toISOString().slice(0, 10);
  const [yy, mm, dd] = rawDate.split('-').map(Number);

  const [slots, setSlots] = React.useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<null | 'book' | 'estimate'>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!API_BASE) return;
    setSelectedTime(null);
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = tokenStore.get();
        const url = `${API_BASE}/v1/reservation/${encodeURIComponent(
          String(VENDOR_ID),
        )}/detail?year=${yy}&month=${mm}&day=${dd}`;
        const res = await fetch(url, {
          cache: 'no-store',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DetailResp = await res.json();
        setSlots(json.data?.timeSlots ?? []);
      } catch (e: any) {
        setError(e?.message ?? '시간 조회 실패');
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [API_BASE, yy, mm, dd]);

  React.useEffect(() => {
    if (!sheet) return;
    const t = setTimeout(() => router.push('/home'), 5000);
    return () => clearTimeout(t);
  }, [sheet, router]);

  const openSheet = (kind: 'book' | 'estimate') => {
    if (!selectedTime) return;
    setSheet(kind);
  };
  const closeSheet = () => setSheet(null);

  const sheetImage = sheet === 'book' ? '/congratu.png' : '/cartCheck.png';
  const sheetText =
    sheet === 'book' ? '예약이 완료 되었어요!' : '견적서에 잘 담았어요!';

  return (
    <ReservationLayout
      title="예약하기"
      step={3}
      headline="시간을 선택해 주세요."
      mode="double"
      leftText="예약하기"
      rightText="견적서 담기"
      onLeft={() => openSheet('book')}
      onRight={() => openSheet('estimate')}
    >
      {loading && (
        <div className="mb-2 text-sm text-text--secondary">
          시간을 불러오는 중…
        </div>
      )}
      {error && <div className="mb-2 text-sm text-red-500">오류: {error}</div>}

      <div className="grid grid-cols-3 gap-4">
        {slots.map((s) => {
          const label = s.timeDisplay?.trim() || s.time;
          const selected = selectedTime === s.time;
          return (
            <TimeChip
              key={`${s.time}-${s.reservationId}`}
              label={label}
              selected={selected}
              disabled={!s.available}
              onClick={() => setSelectedTime(s.time)}
            />
          );
        })}
      </div>

      {sheet && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60]">
          <button
            aria-label="닫기"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={closeSheet}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[420px] h-96 bg-white rounded-t-xl overflow-hidden">
            <div className="w-11 h-0.5 mx-auto mt-3 rounded-full bg-neutral-300" />
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <Image
                src={sheetImage}
                alt={sheetText}
                width={160}
                height={160}
                priority
                className="w-[160px] h-[160px] select-none pointer-events-none"
              />
              <p className="text-[16px] font-semibold text-text--default">
                {sheetText}
              </p>
            </div>
          </div>
        </div>
      )}
    </ReservationLayout>
  );
}
