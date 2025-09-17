'use client';

import ReservationStepLayout from '@/components/reservation/layout/ReservationLayout';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

const months = Array.from({ length: 12 }, (_, i) => i + 1);

function MonthChip({
  month,
  selected,
  onClick,
}: {
  month: number;
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
      {month}월
    </button>
  );
}

export default function TypeFlowPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const productId = sp.get('productId'); // 🔑 유지 필요

  const [selected, setSelected] = React.useState<number[]>([]);
  const toggle = (m: number) =>
    setSelected((prev) =>
      prev.includes(m)
        ? prev.filter((x) => x !== m)
        : [...prev, m].sort((a, b) => a - b),
    );

  const year = new Date().getFullYear();

  return (
    <ReservationStepLayout
      title="예약하기"
      step={2}
      headline="희망하는 달을 선택해 주세요."
      mode="single"
      primaryText="다음"
      active={selected.length > 0}
      onPrimary={() => {
        if (!productId) {
          alert('productId가 없습니다.');
          return;
        }
        router.replace(
          `/reservation/company/select?step=3&months=${selected.join(',')}&productId=${productId}`,
        );
      }}
    >
      <div className="mb-4 text-base font-medium text-text--default">
        {year}년
      </div>

      <div className="grid grid-cols-3 gap-4">
        {months.map((m) => (
          <MonthChip
            key={m}
            month={m}
            selected={selected.includes(m)}
            onClick={() => toggle(m)}
          />
        ))}
      </div>
    </ReservationStepLayout>
  );
}