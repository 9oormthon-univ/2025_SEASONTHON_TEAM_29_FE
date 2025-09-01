// src/app/(main)/tours/page.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import TourList from '@/components/tours/TourList';
import TourTabs from '@/components/tours/TourTabs';
import { getTours } from '@/services/tours.api';
import type { ToursBundle } from '@/types/tour';
import { useEffect, useState } from 'react';

export default function ToursPage() {
  const [data, setData] = useState<ToursBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const bundle = await getTours(); // ✅ 한번에 로드
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
    <main className="w-full max-w-[420px]">
      <Header value="투어일지" className="h-[70px] px-[22px]" />

      {/* 현재 경로 기반으로 활성 탭 표시 */}
      <TourTabs />

      <section className="flex-1 overflow-y-auto">
        {loading && <ToursSkeleton />}
        {!loading && err && (
          <p className="p-4 text-sm text-rose-500">데이터를 불러오지 못했어요. {err}</p>
        )}
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