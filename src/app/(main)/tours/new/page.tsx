// src/app/(main)/tours/new/page.tsx
'use client';

import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';
import { createTour } from '@/services/tours.api';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

function isValidDatetimeLocal(v: string) {
  // 2025-09-02T14:30 형식 간단 검증
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v);
}

export default function NewTourPage() {
  const [vendorName, setVendorName] = useState('');
  const [dateTime, setDateTime] = useState(''); // YYYY-MM-DDTHH:mm
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const canSubmit = useMemo(
    () => vendorName.trim().length > 0 && isValidDatetimeLocal(dateTime),
    [vendorName, dateTime],
  );

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      // 백엔드가 현재 date만 받으므로 날짜만 추출
      const dateOnly = dateTime.slice(0, 10); // 'YYYY-MM-DD'
      await createTour({ vendorName: vendorName.trim(), reservationDate: dateOnly });
      router.replace('/tours');
    } catch (err) {
      alert(err instanceof Error ? err.message : '생성 실패');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-[420px] mx-auto pb-[calc(env(safe-area-inset-bottom)+96px)]">
      <Header value="일정 등록하기" className="h-[50px]" />

      <form onSubmit={onSubmit} className="px-[22px] py-4 space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">업체명</label>
          <input
            type="text"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="업체명을 알려주세요."
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-primary-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">예약날짜</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            // iOS/Safari에서 초 단위 숨기기 & 현재 이후만 허용 등 옵션 필요하면 추가 가능
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-primary-400"
            placeholder="방문예정일과 시간을 적어주세요."
          />
        </div>
      </form>

      {/* 하단 고정 버튼 (공용 Button 사용) */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-[420px] px-[22px] pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 bg-white/80 backdrop-blur">
        <Button
          type="submit"
          fullWidth
          disabled={!canSubmit || submitting}
          className="h-12"
          ariaLabel="일정 등록하기"
          // 폼 submit 트리거
          onClick={(e) => {
            // 가장 쉬운 방법: 폼 submit 호출
            const form = (e.currentTarget.closest('main') as HTMLElement)?.querySelector('form') as HTMLFormElement | null;
            form?.requestSubmit();
          }}
        >
          {submitting ? '등록 중…' : '등록하기'}
        </Button>
      </div>
    </main>
  );
}