import ResultsScreen from '@/components/search/ResultsScreen';
import { filterItems, parseSearchParams } from '@/components/search/search';
import { MOCK_SEARCH_DATA } from '@/data/searchData';
import type { SearchItem, SearchParams } from '@/types/search';

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const qp = parseSearchParams(searchParams);
  const items: SearchItem[] = filterItems(MOCK_SEARCH_DATA, qp);

  return <ResultsScreen items={items} query={qp} />;
}