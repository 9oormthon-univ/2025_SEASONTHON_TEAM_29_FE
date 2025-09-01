'use client';

import type { TourTab, ToursBundle } from '@/types/tour';
import { useMemo, useState } from 'react';
import TourList from './TourList';
import TourTabs from './TourTabs';

export default function ToursClient({ initial }: { initial: ToursBundle }) {
  const [tab, setTab] = useState<TourTab>('dressTour');

  // 필요하면 메모. (여기선 단순 전달이라 없어도 OK)
  const data = useMemo(() => initial, [initial]);

  return (
    <>
      <TourTabs value={tab} onChange={setTab} />
      <section className="flex-1 overflow-y-auto">
        <TourList tab={tab} data={data} />
      </section>
    </>
  );
}