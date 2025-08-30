// src/app/(main)/search/filters/page.tsx
import SearchPage from '@/components/search/SearchPage';

export default function FiltersPage({ searchParams }: { searchParams: { cat?: string } }) {
  const cat = (searchParams.cat ?? null) as any; // 'hall' | 'dress' | 'studio' | 'makeup' | null
  return <SearchPage initialCat={cat} />;
}