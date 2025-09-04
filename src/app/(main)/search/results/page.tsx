// src/app/(main)/search/results/page.tsx
import { SearchResultsClient } from '@/components/search/SearchResultsClient';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchResultsClient />
    </Suspense>
  );
}