'use client';

import type { ToursBundle } from '@/types/tour';
import { useRouter } from 'next/navigation';
import TourItem from './TourItem';

export default function TourList({ data }: { data: ToursBundle }) {
  const router = useRouter();

  return (
    <ul>
      {data.dressTour.map((it) => (
        <TourItem
          key={it.id}
          name={it.vendorName}
          logo={it.mainImageUrl}
          status={it.status === 'WAITING' ? '기록 대기' : '기록 완료'}
          onClick={() => router.push(`/tours/${it.id}`)}
        />
      ))}
    </ul>
  );
}