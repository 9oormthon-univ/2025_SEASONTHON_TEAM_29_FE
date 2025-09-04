'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import StudioListPage from './StudioPage';

export default function CategoryDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cat = searchParams.get('cat');

  useEffect(() => {
    if (cat && ['hall', 'dress', 'makeup'].includes(cat)) {
      router.replace('/coming-soon');
    }
  }, [cat, router]);

  if (cat === 'studio') {
    return <StudioListPage />;
  }

  return null;
}
