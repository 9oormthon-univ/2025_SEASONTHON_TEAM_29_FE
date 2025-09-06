'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReservationLayout from '@/components/reservation/layout/ReservationLayout';
import ReservationButton from '@/components/reservation/ReservationButton';

type TypeKey = 'consult' | 'company';

export default function ReservationPage() {
  const [selected, setSelected] = useState<TypeKey | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendor');

  return (
    <ReservationLayout
      title="예약하기"
      step={1}
      headline="예약 형태를 선택해주세요."
      mode="single"
      primaryText="다음"
      active={!!selected}
      onPrimary={() => {
        if (!selected) return;
        if (!vendorId) {
          alert('vendorId가 없습니다.');
          return;
        }
        if (selected === 'consult') {
          router.push(`/reservation/consult/days?step=2&vendorId=${vendorId}`);
        } else {
          router.push(
            `/reservation/company/months?step=2&vendorId=${vendorId}`,
          );
        }
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <ReservationButton
          variant={selected === 'consult' ? 'primary' : 'default'}
          onClick={() => setSelected('consult')}
        >
          상담 예약하기
        </ReservationButton>
        <ReservationButton
          variant={selected === 'company' ? 'primary' : 'default'}
          onClick={() => setSelected('company')}
        >
          업체 예약하기
        </ReservationButton>
      </div>
    </ReservationLayout>
  );
}
