// src/app/(main)/search/map/page.tsx
import MapSearchPage from '@/components/search/MapSearchPage';
import { Suspense } from 'react';

export default function MapPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>지도를 불러오는 중...</span>
      </div>
    }>
      <MapSearchPage />
    </Suspense>
  );
}

