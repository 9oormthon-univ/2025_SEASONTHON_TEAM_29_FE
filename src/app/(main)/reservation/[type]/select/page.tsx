'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ReservationStepLayout from '@/components/reservation/layout/ReservationLayout';
import ReservationCard from '@/components/reservation/ReservationCard';

type TypeKey = 'consult' | 'company';

const slots = [
  {
    id: 1,
    date: '26.06.07 일요일 11:00',
    hallFee: '6,380,000원',
    minGuests: '210명',
    mealFee: '14,784,000원',
  },
  {
    id: 2,
    date: '26.06.07 일요일 11:00',
    hallFee: '3,330,000원',
    minGuests: '250명',
    mealFee: '15,345,000원',
  },
  {
    id: 3,
    date: '26.06.07 일요일 11:00',
    hallFee: '6,356,000원',
    minGuests: '230명',
    mealFee: '18,834,000원',
  },
];

export default function SlotSelectPage() {
  const { type } = useParams<{ type: TypeKey }>();
  const sp = useSearchParams();
  const monthsPicked = sp.get('months') ?? '';
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <ReservationStepLayout
      title="예약하기"
      step={3}
      headline={
        <>
          계약 가능한 시간대입니다.
          <br />
          하나를 선택해 주세요.
        </>
      }
      mode="double"
      leftText="계약금 결제"
      rightText="견적서 담기"
      onLeft={() =>
        selectedId && console.log('결제:', type, selectedId, monthsPicked)
      }
      onRight={() => console.log('견적 담기:', type, selectedId, monthsPicked)}
    >
      <div className="flex flex-col gap-4 items-center">
        {slots.map((s) => (
          <ReservationCard
            key={s.id}
            date={s.date}
            hallFee={s.hallFee}
            minGuests={s.minGuests}
            mealFee={s.mealFee}
            selected={selectedId === s.id}
            variant={selectedId === s.id ? 'pink' : 'white'}
            onClick={() => setSelectedId(s.id)}
          />
        ))}
      </div>
    </ReservationStepLayout>
  );
}
