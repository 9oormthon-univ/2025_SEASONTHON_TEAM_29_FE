'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReservationStepLayout from '@/components/reservation/layout/ReservationLayout';
import ReservationCard from '@/components/reservation/ReservationCard';

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
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  useEffect(() => {
    if (!sheetOpen) return;
    const t = setTimeout(() => router.push('/home'), 5000);
    return () => clearTimeout(t);
  }, [sheetOpen, router]);

  const openSheet = () => {
    if (!selectedId) return;
    setSheetOpen(true);
  };

  return (
    <>
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
        onLeft={() => selectedId && router.push(`/reservation/company/finish`)}
        onRight={openSheet}
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
        {sheetOpen && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60]">
            <button
              aria-label="닫기"
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              onClick={() => setSheetOpen(false)}
            />
            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[420px] h-96 bg-white rounded-t-xl overflow-hidden">
              <div className="w-11 h-0.5 mx-auto mt-3 rounded-full bg-neutral-300" />
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <Image
                  src="/cartCheck.png"
                  alt="견적 담기 완료"
                  width={160}
                  height={160}
                  priority
                  className="w-[160px] h-[160px] select-none pointer-events-none"
                />
                <p className="text-[16px] font-semibold text-text--default">
                  견적서에 잘 담았어요!
                </p>
              </div>
            </div>
          </div>
        )}
      </ReservationStepLayout>
    </>
  );
}
