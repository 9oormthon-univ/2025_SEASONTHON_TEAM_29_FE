// src/components/tours/TourList.tsx
'use client';

import type { ToursBundle } from '@/types/tour';
import TourItem from './TourItem';

export default function TourList({ data }: { data: ToursBundle }) {
  return (
    <ul>
      {data.dressTour.map((it) => (
        <TourItem
          key={it.id}
          name={it.brandName}
          logo={it.logoUrl}
          status={it.status === 'PENDING' ? '기록 대기' : '기록 완료'}
        />
      ))}
    </ul>
  );
}