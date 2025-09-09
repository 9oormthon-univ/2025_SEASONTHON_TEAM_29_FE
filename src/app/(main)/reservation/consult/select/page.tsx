'use client';

import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import { addToEstimate, createReservation, getReservationTimes, type ReservationTimeEx } from '@/services/reservation.api';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

function TimeChip({
  label, selected, disabled, onClick,
}: { label: string; selected: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'h-14 w-full rounded-[100px] px-6 text-sm font-medium inline-flex items-center justify-center',
        'outline outline-offset-[-1px] transition-opacity',
        selected ? 'bg-primary-200 outline-2 outline-primary-300' : 'outline-1 outline-box-line',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {label}
    </button>
  );
}

const getErr = (e: unknown) => e instanceof Error ? e.message : '시간 조회 실패';

export default function ConsultTimePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const vendorIdStr = sp.get('vendorId');
  const vendorId = vendorIdStr && !Number.isNaN(Number(vendorIdStr)) ? Number(vendorIdStr) : null;

  const rawDate = sp.get('date') ?? new Date().toISOString().slice(0, 10);
  const [yy, mm, dd] = rawDate.split('-').map(Number);

  const [slots, setSlots] = React.useState<ReservationTimeEx[]>([]);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<null | 'book' | 'estimate'>(null);

  const backTo = React.useMemo(() => {
    const ret = sp.get('return');
    if (ret && /^\/[A-Za-z0-9/_?&=%.-]*$/.test(ret)) return ret;
    return vendorId != null ? `/vendor/hall/${vendorId}` : '/home';
  }, [sp, vendorId]);

  // 날짜 바뀔 때 선택 초기화
  React.useEffect(() => setSelectedTime(null), [rawDate]);

  // 시간 슬롯 로드
  React.useEffect(() => {
    if (vendorId == null) {
      setError('유효한 vendorId가 없습니다.');
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReservationTimes({ vendorId, year: yy, month: mm, day: dd });
        setSlots(data);
      } catch (e) {
        setError(getErr(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId, yy, mm, dd]);

  // 완료 시 자동 이동
  React.useEffect(() => {
    if (!sheet) return;
    const t = setTimeout(() => router.push(backTo), 1500);
    return () => clearTimeout(t);
  }, [sheet, router, backTo]);

  const handleReserve = async () => {
    if (!selectedTime || vendorId === null) return;
    try {
      setPosting(true);
      setError(null);
      await createReservation({ vendorId, date: rawDate, time: selectedTime });
      setSheet('book');
    } catch (e) {
      setError(getErr(e));
    } finally {
      setPosting(false);
    }
  };

  const handleAddToEstimate = async () => {
    if (!selectedTime || vendorId === null) return;
    try {
      setAdding(true);
      setError(null);
      await addToEstimate({ vendorId, date: rawDate, time: selectedTime });
      setSheet('estimate');
    } catch (e) {
      setError(getErr(e));
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
      {loading && <div className="text-sm text-text--secondary">시간을 불러오는 중…</div>}
      {error && <div className="text-sm text-red-500">오류: {error}</div>}

      <div className="grid grid-cols-3 gap-4">
        {slots.map((s) => (
          <TimeChip
            key={`${s.id ?? s.time}`}
            label={s.display ?? s.time}
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
                alt={sheet === 'book' ? '예약이 완료 되었어요!' : '견적서에 잘 담았어요!'}
                width={160}
                height={160}
                priority
                className="w-[160px] h-[160px] select-none pointer-events-none"
              />
              <p className="text-[16px] font-semibold text-text--default">
                {sheet === 'book' ? '예약이 완료 되었어요!' : '견적서에 잘 담았어요!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </ReservationLayout>
  );
}