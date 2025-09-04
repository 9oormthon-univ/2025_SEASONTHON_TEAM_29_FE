'use client';

import * as React from 'react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';

function TimeChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'h-14 w-full rounded-[100px] px-6 text-sm font-medium inline-flex items-center justify-center',
        'outline outline-offset-[-1px]',
        selected
          ? 'bg-primary-200 outline-2 outline-primary-300'
          : 'outline-1 outline-box-line',
      )}
    >
      {label}
    </button>
  );
}

const TIMES = [
  '10:00',
  '10:30',
  '11:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

export default function ConsultTimePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const date = sp.get('date') ?? '';

  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState<null | 'book' | 'estimate'>(null);

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
      <div className="grid grid-cols-3 gap-4">
        {TIMES.map((t) => (
          <TimeChip
            key={t}
            label={t}
            selected={selectedTime === t}
            onClick={() => setSelectedTime(t)}
          />
        ))}
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
