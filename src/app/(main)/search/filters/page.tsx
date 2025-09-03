import SearchPage from '@/components/search/SearchPage';
import type { CategoryKey } from '@/types/category';
import { Suspense } from 'react';

type SearchParams = { cat?: string | string[] };

export default function FiltersPage({ searchParams }: { searchParams: SearchParams }) {
  const catParam = Array.isArray(searchParams.cat) ? searchParams.cat[0] : searchParams.cat;
  const cat = (catParam ?? null) as CategoryKey | null;
  return (
    <Suspense fallback={<div className="p-6">로딩 중…</div>}>
      <SearchPage initialCat={cat} />;
    </Suspense>
  )
}