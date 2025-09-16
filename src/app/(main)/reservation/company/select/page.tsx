'use client';

import ReservationStepLayout from '@/components/reservation/layout/ReservationLayout';
import ReservationCard from '@/components/reservation/ReservationCard';
import { useContractSlots } from '@/hooks/useContractSlots';
import { formatMoney, formatSlot } from '@/lib/format';
import { addCartItem } from '@/services/cart.api';
import { createContract } from '@/services/contract.api';
import type { ContractSlot } from '@/types/contract';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

// ✅ Lottie 추가
import cartAnim from '@/assets/animations/cart.json';
import congratsAnim from '@/assets/animations/congrats.json';
import Lottie from 'lottie-react';

function toReservationCardPropsFromContract(s: ContractSlot) {
  return {
    date: formatSlot(s.startTime),
    hallFee: formatMoney(s.price),
    minGuests: s.details?.expectedGuests ? `${s.details.expectedGuests}명` : '-',
    mealFee: s.details?.expectedMealCost
      ? formatMoney(Number(s.details.expectedMealCost))
      : '-',
  };
}

export default function SlotSelectPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const productId = useMemo(() => Number(sp.get('productId') ?? 0), [sp]);

  const months = useMemo(() => {
    const now = new Date();
    const m = now.getMonth() + 1;
    return [m, m + 1, m + 2].map((x) => ((x - 1) % 12) + 1);
  }, []);

  const { slots, loading, error, refetch } = useContractSlots(productId, months);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState<null | 'estimate' | 'contract'>(null);
  const [adding, setAdding] = useState(false);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 계약 생성
  const handleCreateContract = async () => {
    if (!selectedId) return;
    try {
      setPosting(true);
      setErr(null);
      await createContract({ availableSlotId: selectedId });
      setSheetOpen('contract');
    } catch (e) {
      setErr(e instanceof Error ? e.message : '계약 생성에 실패했어요.');
    } finally {
      setPosting(false);
    }
  };

  // 견적 담기 → cart API
  const handleAddEstimate = async () => {
    if (!selectedId) return;
    const slot = slots.find((s) => s.availableSlotId === selectedId);
    if (!slot) return;

    try {
      setAdding(true);
      setErr(null);
      await addCartItem(productId, slot.startTime);
      setSheetOpen('estimate');
    } catch (e) {
      setErr(e instanceof Error ? e.message : '견적 담기에 실패했어요.');
    } finally {
      setAdding(false);
    }
  };

  const handleLottieComplete = () => {
    router.push('/home');
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
      leftText={posting ? '계약 중…' : '계약금 결제'}
      rightText={adding ? '담는 중…' : '견적서 담기'}
      onLeft={handleCreateContract}
      onRight={handleAddEstimate}
    >
      {error && (
        <p className="text-sm text-red-500 text-center my-2">
          {error}{' '}
          <button className="underline" onClick={refetch}>
            다시 시도
          </button>
        </p>
      )}
      {err && <p className="text-sm text-red-500 text-center my-1">{err}</p>}

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
              key={s.availableSlotId}
              {...cardProps}
              selected={selectedId === s.availableSlotId}
              variant={selectedId === s.availableSlotId ? 'pink' : 'white'}
              onClick={() => setSelectedId(s.availableSlotId)}
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
            onClick={() => setSheetOpen(null)}
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[420px] h-96 bg-white rounded-t-xl overflow-hidden">
            <div className="w-11 h-0.5 mx-auto mt-3 rounded-full bg-neutral-300" />
            <div className="h-full flex flex-col items-center justify-center gap-6">
              {/* ✅ 이미지 대신 Lottie */}
              <Lottie
                animationData={sheetOpen === 'contract' ? congratsAnim : cartAnim}
                loop={2}
                autoplay
                onComplete={handleLottieComplete}
                style={{ width: 160, height: 160 }}
                className="w-[160px] h-[160px] select-none pointer-events-none"
              />
              <p className="text-[16px] font-semibold text-text--default">
                {sheetOpen === 'contract'
                  ? '계약이 완료 되었어요!'
                  : '견적서에 잘 담았어요!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </ReservationStepLayout>
  );
}