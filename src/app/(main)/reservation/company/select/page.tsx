'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ReservationStepLayout from '@/components/reservation/layout/ReservationLayout';
import ReservationCard from '@/components/reservation/ReservationCard';
import { useContractSlots } from '@/hooks/useContractSlots';
import { formatMoney, formatSlot } from '@/lib/format';
import type { ContractSlot } from '@/types/estimate';

function toReservationCardPropsFromContract(s: ContractSlot) {
  return {
    date: formatSlot(s.dateISO),
    hallFee: formatMoney(s.hallFee),
    minGuests: `${s.minGuests}명`,
    mealFee: formatMoney(s.mealFee),
  };
}

export default function SlotSelectPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const vendorId = useMemo(() => Number(sp.get('vendorId') ?? 1), [sp]);
  const { slots, loading, error, refetch } = useContractSlots({ vendorId });

  const [selectedId, setSelectedId] = useState<string | null>(null);
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
        selectedId &&
        router.push(
          `/reservation/company/finish?vendorId=${vendorId}&slotId=${selectedId}`,
        )
      }
      onRight={openSheet}
    >
      {error && (
        <p className="text-sm text-red-500 text-center my-2">
          {error}{' '}
          <button className="underline" onClick={refetch}>
            다시 시도
          </button>
        </p>
      )}

      <div className="flex flex-col gap-4 items-center">
        {loading &&
          slots.length === 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[420px] h-24 rounded-2xl bg-primary-100 animate-pulse"
            />
          ))}

        {slots.map((s: ContractSlot) => {
          const cardProps = toReservationCardPropsFromContract(s);
          return (
            <ReservationCard
              key={s.id}
              {...cardProps}
              selected={selectedId === s.id}
              variant={selectedId === s.id ? 'pink' : 'white'}
              onClick={() => setSelectedId(s.id)}
            />
          );
        })}

        {!loading && slots.length === 0 && (
          <p className="text-sm text-text--secondary">
            조회된 계약 가능 시간이 없습니다.
          </p>
        )}
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
  );
}
