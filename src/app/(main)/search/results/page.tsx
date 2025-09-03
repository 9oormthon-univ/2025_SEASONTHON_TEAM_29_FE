// src/app/(main)/search/results/page.tsx
import { SearchResultsClient } from '@/components/search/SearchResultsClient';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <SearchResultsClient />
    </Suspense>
  );
}

function ResultsFallback() {
  return <div className="p-4 text-sm text-gray-500">검색 결과 불러오는 중…</div>;
}