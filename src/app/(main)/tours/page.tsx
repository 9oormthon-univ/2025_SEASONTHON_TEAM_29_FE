'use client';

import Header from '@/components/common/monocules/Header';
import TourList from '@/components/tours/TourList';
import TourTabs from '@/components/tours/TourTabs';
import { getTourRomanceList } from '@/services/tourRomance.api';
import { getTours } from '@/services/tours.api';
import type { ToursBundle, TourTab } from '@/types/tour';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function PlusButton({ activeTab }: { activeTab: TourTab }) {
  const href = activeTab === 'dressRomance' ? '/tours/romance/new' : '/reservations';
  const label = activeTab === 'dressRomance' ? '일정 등록하기' : '상담 예약하기';

  return (
    <Link
      href={href}
      aria-label={label}
      className="h-9 w-9 rounded-full text-text-secondary text-extrabold active:scale-95 flex items-center justify-center"
      title={label}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    </Link>
  );
}

export default function ToursPage() {
  const [data, setData] = useState<ToursBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TourTab>('dressTour');
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (activeTab === 'dressTour') {
          const bundle = await getTours();
          console.log(bundle);
          if (!alive) return;
          setData(bundle);
        } else {
          const romance = await getTourRomanceList({ page: 0, size: 50 });
          if (!alive) return;
          setData({ dressTour: [], dressRomance: romance });
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : '로드 오류');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [activeTab]);

  const isEmpty =
    !loading &&
    !err &&
    (!data ||
      (activeTab === 'dressTour'
        ? data.dressTour.length === 0
        : data.dressRomance.length === 0));
  console.log(data);

  return (
    <main className="w-full max-w-[420px] mx-auto pb-[96px]">
      <Header
        showBack
        onBack={() => router.push('/home')}
        value="투어일지"
        rightSlot={<PlusButton activeTab={activeTab} />}
      />

      <TourTabs value={activeTab} onChange={setActiveTab} />

      <section className="flex-1 overflow-y-auto">
        {loading && <p className="p-4">불러오는 중…</p>}
        {isEmpty && <p className="p-4 text-sm text-gray-500">데이터가 없습니다.</p>}
        {!loading && !err && data && <TourList data={data} activeTab={activeTab} />}
      </section>
    </main>
  );
}