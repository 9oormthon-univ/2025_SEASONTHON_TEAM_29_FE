// src/components/search/SearchResultsClient.tsx
'use client';
import ResultsScreen from '@/components/search/ResultsScreen';
import { mapMealKoToApi, mapStyleKoToApi, parseGuestKo } from '@/services/mappers/searchMappers';
import { searchWeddingHalls } from '@/services/weddingHall.api';
import type { SearchItem } from '@/types/search';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function SearchResultsClient() {
  const sp = useSearchParams();

  const query = useMemo(() => {
    const styles = sp.getAll('style');     // ['채플', ...]
    const meals  = sp.getAll('meal');      // ['뷔페', ...]
    const guest  = sp.get('guest');        // '100명'
    const price  = sp.get('price');        // '10' (만원)
    const districts = sp.getAll('region'); // ['강남구', '마포구', ...]

    return {
      districts: districts.length ? districts : undefined,
      styles: mapStyleKoToApi(styles),
      meals:  mapMealKoToApi(meals),
      requiredGuests: parseGuestKo(guest),
      maxPrice: price ? Number(price) * 10_000 : undefined,
    };
  }, [sp]);

  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const { items } = await searchWeddingHalls(
          { ...query, page: 0, size: 12 },
          // 공개 엔드포인트면: { skipAuth: true }
        );

        if (!cancelled) setItems(items);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : '검색 실패');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [query]);

  return <ResultsScreen items={items} loading={loading} />;
}