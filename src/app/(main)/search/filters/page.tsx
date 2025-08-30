// src/app/(main)/search/filters/page.tsx
import SearchPage from '@/components/search/SearchPage';

export default function FiltersPage({ searchParams }: { searchParams: { cat?: string } }) {
  const cat = (searchParams.cat ?? null) as any;
  return <SearchPage initialCat={cat} />;
}