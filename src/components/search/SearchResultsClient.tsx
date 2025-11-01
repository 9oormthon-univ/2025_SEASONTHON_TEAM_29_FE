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

    // 지도에서 선택된 매장인지 확인
    const vendorId = sp.get('vendorId');
    const lat = sp.get('lat');
    const lng = sp.get('lng');
    const storeName = sp.get('storeName');

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
            // 지도에서 선택된 매장 정보 추가
            ...(vendorId && { vendorId: Number(vendorId) }),
            ...(lat && lng && { latitude: Number(lat), longitude: Number(lng) }),
            ...(storeName && { storeName }),
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
            // 지도에서 선택된 매장 정보 추가
            ...(vendorId && { vendorId: Number(vendorId) }),
            ...(lat && lng && { latitude: Number(lat), longitude: Number(lng) }),
            ...(storeName && { storeName }),
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
            // 지도에서 선택된 매장 정보 추가
            ...(vendorId && { vendorId: Number(vendorId) }),
            ...(lat && lng && { latitude: Number(lat), longitude: Number(lng) }),
            ...(storeName && { storeName }),
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
            // 지도에서 선택된 매장 정보 추가
            ...(vendorId && { vendorId: Number(vendorId) }),
            ...(lat && lng && { latitude: Number(lat), longitude: Number(lng) }),
            ...(storeName && { storeName }),
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