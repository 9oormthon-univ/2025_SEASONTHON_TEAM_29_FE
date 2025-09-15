// src/app/(main)/tours/page.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import TourList from '@/components/tours/TourList';
import TourTabs from '@/components/tours/TourTabs';
import { getTours } from '@/services/tours.api';
import type { ToursBundle } from '@/types/tour';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function PlusButton() {
  // 생성은 예약에서만 → 예약 화면으로 보냄 (경로는 프로젝트에 맞게 수정)
  return (
    <Link
      href="/reservations"
      aria-label="상담 예약하기"
      className="h-9 w-9 rounded-full text-text-secondary text-extrabold active:scale-95 flex items-center justify-center"
      title="상담 예약하기"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center text-text-secondary">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gray-100 ring-1 ring-gray-200">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <path d="M3 7h18M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 7V5a3 3 0 0 1 3-3 3 3 0 0 1 3 3v2" />
        </svg>
      </div>
      <h2 className="mb-2 text-base font-semibold text-text-primary">아직 예약된 드레스 투어가 없어요</h2>
      <p className="mb-6 text-sm leading-6">상담 예약을 진행하면 투어일지가 자동으로 생성돼요.</p>
      <Link
        href="/reservations"
        className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-primary-500 text-white active:scale-95"
      >
        상담 예약하러 가기
      </Link>
    </div>
  );
}

export default function ToursPage() {
  const [data, setData] = useState<ToursBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const bundle = await getTours({ page: 0, size: 50 });
        if (!alive) return;
        setData(bundle);
      } catch (e) {
        setErr(e instanceof Error ? e.message : '로드 오류');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const isEmpty = !loading && !err && (!data || data.dressTour.length === 0);

  return (
    <main className="w-full max-w-[420px] mx-auto pb-[96px]">
      <Header showBack onBack={() => router.back()} value="투어일지" rightSlot={<PlusButton />} />
      <TourTabs />
      <section className="flex-1 overflow-y-auto">
        {loading && <ToursSkeleton />}
        {!loading && err && <p className="p-4 text-sm text-rose-500">데이터를 불러오지 못했어요. {err}</p>}
        {isEmpty && <EmptyState />}
        {!loading && !err && data && data.dressTour.length > 0 && <TourList data={data} />}
      </section>
    </main>
  );
}

function ToursSkeleton() {
  return (
    <ul>
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="relative select-none px-[22px] py-4" aria-hidden="true">
          <div className="flex items-center gap-3">
            <div className="h-[50px] w-[50px] rounded-2xl bg-gray-100 ring-1 ring-gray-100 animate-pulse" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-16 rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="pointer-events-none absolute bottom-0 left-[22px] right-[22px] h-px bg-gray-200/60" />
        </li>
      ))}
    </ul>
  );
}