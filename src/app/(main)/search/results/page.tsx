import ResultsScreen from '@/components/search/ResultsScreen';
import { filterItems, parseSearchParams } from '@/components/search/search';
import { SEARCH_ITEMS } from '@/data/searchData';
import type { SearchParams } from '@/types/search';

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const qp = parseSearchParams(searchParams);
  const items = filterItems(SEARCH_ITEMS, qp);

  return <ResultsScreen items={items} />;
}