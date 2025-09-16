'use client';

import ResultsScreen from '@/components/search/ResultsScreen';
import { useSearch, type SearchParams } from '@/hooks/useSearch';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function SearchResultsClient() {
  const sp = useSearchParams();

  const params = useMemo<SearchParams | null>(() => {
    const cat = sp.get('cat') as SearchParams['category'] | null;
    if (!cat) return null;

    const regionCode = sp.getAll('region');
    const price = Number(sp.get('price') ?? 0);

    switch (cat) {
      case 'hall':
        return {
          category: 'hall',
          body: {
            regionCode,
            price,
            hallStyle: sp.getAll('hallStyle'),   
            hallMeal: sp.getAll('hallMeal'),     
            capacity: Number(sp.get('guest') ?? 0),
            hasParking: sp.has('hasParking')
              ? sp.get('hasParking') === 'true'
              : null,
          },
        };
      case 'dress':
        return {
          category: 'dress',
          body: {
            regionCode,
            price,
            dressStyle: sp.getAll('dressStyle'),
            dressOrigin: sp.getAll('dressOrigin'),
          },
        };
      case 'studio':
        return {
          category: 'studio',
          body: {
            regionCode,
            price,
            studioStyle: sp.getAll('studioStyle'), 
            specialShots: sp.getAll('specialShots'),
            iphoneSnap: sp.has('iphoneSnap')
              ? sp.get('iphoneSnap') === 'true'
              : null,
          },
        };
      case 'makeup':
        return {
          category: 'makeup',
          body: {
            regionCode,
            price,
            makeupStyle: sp.getAll('makeupStyle'),                  
            isStylistDesignationAvailable: sp.has('stylist')
              ? sp.get('stylist') === 'true'
              : null,
            hasPrivateRoom: sp.has('room')
              ? sp.get('room') === 'true'
              : null,             
          },
        };
    }
  }, [sp]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearch(params);

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <ResultsScreen
      items={items}
      loading={!!params && isLoading}
      onLoadMore={params && hasNextPage ? fetchNextPage : undefined}
      isFetchingMore={isFetchingNextPage}
    />
  );
}