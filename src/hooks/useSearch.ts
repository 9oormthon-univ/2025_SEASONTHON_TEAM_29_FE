'use client';

import {
  searchDresses,
  searchMakeups,
  searchStudios,
  searchWeddingHalls,
} from '@/services/search';
import type { DressSearchReq } from '@/services/search/dress.api';
import type { HallSearchReq } from '@/services/search/hall.api';
import type { MakeupSearchReq } from '@/services/search/makeup.api';
import type { StudioSearchReq } from '@/services/search/studio.api';
import { useInfiniteQuery } from '@tanstack/react-query';

export type SearchParams =
  | { category: 'hall'; body: HallSearchReq }
  | { category: 'dress'; body: DressSearchReq }
  | { category: 'studio'; body: StudioSearchReq }
  | { category: 'makeup'; body: MakeupSearchReq };

export function useSearch(args: SearchParams | null) {
  return useInfiniteQuery({
    queryKey: ['search', args],
    enabled: !!args, // ✅ args 없으면 호출 안 함
    queryFn: async ({ pageParam = 0 }) => {
      if (!args) {
        return { items: [], totalPages: 0, totalElements: 0, pageSize: 0 };
      }
      switch (args.category) {
        case 'hall':
          return searchWeddingHalls({ ...args.body, page: pageParam });
        case 'dress':
          return searchDresses({ ...args.body, page: pageParam });
        case 'studio':
          return searchStudios({ ...args.body, page: pageParam });
        case 'makeup':
          return searchMakeups({ ...args.body, page: pageParam });
      }
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.totalPages > allPages.length ? allPages.length : undefined,
    initialPageParam: 0,
  });
}