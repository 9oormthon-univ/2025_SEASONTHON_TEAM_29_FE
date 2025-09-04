// src/app/(main)/tours/page.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import TourList from '@/components/tours/TourList';
import TourTabs from '@/components/tours/TourTabs';
import { getTours } from '@/services/tours.api';
import type { ToursBundle } from '@/types/tour';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function PlusButton() {
  return (
    <Link
      href="/tours/new"
      aria-label="투어 추가"
      className="h-9 w-9 rounded-full text-text-secondary text-extrabold
                 active:scale-95 flex items-center justify-center"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    </Link>
  );
}

export default function ToursPage() {
  const [data, setData] = useState<ToursBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const bundle = await getTours();
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

  return (
    <main className="w-full max-w-[420px] mx-auto">
      <Header
        value="투어일지"
        rightSlot={<PlusButton />}  // ✅ 우측에 + 버튼
      />
      <TourTabs />
      <section className="flex-1 overflow-y-auto">
        {loading && <ToursSkeleton />}
        {!loading && err && <p className="p-4 text-sm text-rose-500">데이터를 불러오지 못했어요. {err}</p>}
        {!loading && data && <TourList data={data} />}
      </section>
    </main>
  );
}

function ToursSkeleton() {
  return (
    <ul className="divide-y animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-4 py-4">
          <div className="h-10 w-10 rounded bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="mt-2 h-3 w-24 rounded bg-gray-200" />
          </div>
          <div className="h-5 w-14 rounded-full bg-gray-200" />
        </li>
      ))}
    </ul>
  );
}