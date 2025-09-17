'use client';

import type { ToursBundle, TourTab } from '@/types/tour';
import { useRouter } from 'next/navigation';
import TourItem from './TourItem';

export default function TourList({ data, activeTab }: { data: ToursBundle; activeTab: TourTab }) {
  const router = useRouter();

  if (activeTab === 'dressRomance') {
    return (
      <ul>
        {data.dressRomance.map((it) => (
          <TourItem
            key={it.id}
            name={it.title}
            onClick={() => router.push(`/tours/romance/${it.id}`)}
            logo="/icons/pwa180-2.png"
          />
        ))}
      </ul>
    );
  }

  return (
    <ul>
      {data.dressTour.map((it) => (
        <TourItem
          key={it.id}
          name={it.vendorName}
          logo={it.logoImageUrl}
          status={it.status === 'WAITING' ? '기록 대기' : '기록 완료'}
          onClick={() => router.push(`/tours/${it.id}`)}
        />
      ))}
    </ul>
  );
}