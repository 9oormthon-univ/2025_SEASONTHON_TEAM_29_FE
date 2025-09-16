'use client';

import congrats from '@/assets/animations/congrats.json';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import { createReservation, getDailySlots } from '@/services/reservation.api';
import { ReservationSlot } from '@/types/reservation';
import { formatTimeHM } from '@/utills/time';
import clsx from 'clsx';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

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

export default function ConsultTimePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const vendorIdStr = sp.get('vendorId');
  const vendorId =
    vendorIdStr && !Number.isNaN(Number(vendorIdStr))
      ? Number(vendorIdStr)
      : null;

  const rawDate = sp.get('date') ?? new Date().toISOString().slice(0, 10);
  const [yy, mm, dd] = rawDate.split('-').map(Number);

  const [slots, setSlots] = React.useState<ReservationSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = React.useState<number | null>(
    null,
  );
  const [loading, setLoading] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  // ✅ Lottie 제어용 ref, state
  const lottieRef = React.useRef<LottieRefCurrentProps>(null);
  const [plays, setPlays] = React.useState(0);

  // 슬롯 로드
  React.useEffect(() => {
    if (vendorId == null) {
      setError('유효한 vendorId가 없습니다.');
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDailySlots({
          vendorId,
          year: yy,
          month: mm,
          day: dd,
        });
        setSlots(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '시간 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, [vendorId, yy, mm, dd]);

  // 완료 시 → done true → plays 초기화
  React.useEffect(() => {
    if (done) setPlays(0);
  }, [done]);

  const handleReserve = async () => {
    if (!selectedSlotId) return;
    try {
      setPosting(true);
      setError(null);
      await createReservation({ slotId: selectedSlotId });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : '예약 실패');
    } finally {
      setPosting(false);
    }
  };

  // ✅ Lottie 완료 이벤트 핸들러
  const handleLottieComplete = () => {
    setPlays((prev) => {
      const next = prev + 1;
      if (next < 2) {
        // 2회 전이면 다시 재생
        lottieRef.current?.goToAndPlay(0, true);
      } else {
        // 2회 끝나면 홈으로 이동
        router.push('/home');
      }
      return next;
    });
  };

  return (
    <ReservationLayout
      title="예약하기"
      step={3}
      headline="시간을 선택해 주세요."
      mode="single"
      primaryText={posting ? '예약 중...' : '예약하기'}
      active={!!selectedSlotId && !posting}
      onPrimary={handleReserve}
    >
      {loading && (
        <div className="text-sm text-text--secondary">시간을 불러오는 중…</div>
      )}
      {error && <div className="text-sm text-red-500">오류: {error}</div>}

      <div className="grid grid-cols-3 gap-4">
        {slots.map((s) => (
          <TimeChip
            key={s.slotId}
            label={`${formatTimeHM(s.startTime)}`}
            selected={selectedSlotId === s.slotId}
            disabled={s.status !== 'AVAILABLE'}
            onClick={() => setSelectedSlotId(s.slotId)}
          />
        ))}
      </div>

      {done && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60]">
          <button
            aria-label="닫기"
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setDone(false)}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[420px] h-96 bg-white rounded-t-xl overflow-hidden">
            <div className="w-11 h-0.5 mx-auto mt-3 rounded-full bg-neutral-300" />
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <Lottie
                lottieRef={lottieRef}
                animationData={congrats}
                loop={false}      // 무한 반복 ❌
                autoplay
                onComplete={handleLottieComplete}
                style={{ width: 157, height: 181 }}
                className="w-[157px] h-[181px] select-none pointer-events-none"
              />
              <p className="text-[16px] font-semibold text-text--default">
                예약이 완료 되었어요!
              </p>
            </div>
          </div>
        </div>
      )}
    </ReservationLayout>
  );
}