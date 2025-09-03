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
    const styles = sp.getAll('style');
    const meals  = sp.getAll('meal');
    const guest  = sp.get('guest');
    const price  = sp.get('price'); // 만원 단위 문자열
    return {
      styles,
      meals,
      guest,
      minPrice: price ? Number(price) * 10_000 : undefined, // 원
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

        const style = mapStyleKoToApi(query.styles);
        const meal  = mapMealKoToApi(query.meals);
        const minGuestCount = parseGuestKo(query.guest);

        const { items } = await searchWeddingHalls(
          {
            style,
            meal,
            minGuestCount,
            minPrice: query.minPrice, // 최소가격(백엔드 스웨거)
            page: 0,
            size: 12,
          },
          // 공개 엔드포인트면 주석 해제:
          // { skipAuth: true }
        );

        if (!cancelled) setItems(items);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : '검색 실패');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [query.styles, query.meals, query.guest, query.minPrice]);

  return <ResultsScreen items={items} loading={loading} />;
}