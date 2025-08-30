// src/data/searchItems.ts  ← 새 파일(또는 기존 searchData.ts 대체)
import { hallVendors, makeupVendors, studioVendors } from '@/data/homeData';
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';
import type { VendorItem } from '@/types/vendor';

const fromVendors = (cat: CategoryKey, vs: VendorItem[]): SearchItem[] =>
  vs.map(v => ({
    id: v.id,
    name: v.name,
    region: v.region,
    cat,
    price: v.price,
    logo: v.logo,
    rating: v.rating,
    count: v.count,
    // 필요하면 태그도 붙이기
    tags: [],
  }));

export const SEARCH_ITEMS: SearchItem[] = [
  ...fromVendors('hall', hallVendors),
  ...fromVendors('studio', studioVendors),
  ...fromVendors('makeup', makeupVendors),
];