//src/app/(main)/search/page.tsx
import SearchPage from '@/components/search/SearchPage';
import type { CategoryKey } from '@/types/category';
import { Suspense } from 'react';

type SearchParams = { cat?: string | string[] };

export default async function FiltersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams; // ✅ Next 15: Promise를 await
  const catParam = Array.isArray(sp.cat) ? sp.cat[0] : sp.cat;
  const cat = (catParam ?? null) as CategoryKey | null;

  return (
    <Suspense fallback={null}>
      <SearchPage initialCat={cat} />
    </Suspense>
  );
}