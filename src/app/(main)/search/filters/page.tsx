import SearchPage from '@/components/search/SearchPage';
import type { CategoryKey } from '@/types/category';

type SearchParams = { cat?: string | string[] };

export default function FiltersPage({ searchParams }: { searchParams: SearchParams }) {
  const catParam = Array.isArray(searchParams.cat) ? searchParams.cat[0] : searchParams.cat;
  const cat = (catParam ?? null) as CategoryKey | null;
  return <SearchPage initialCat={cat} />;
}