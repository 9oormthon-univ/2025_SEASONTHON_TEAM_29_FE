// src/data/searchData.ts
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';
import { hallVendors, makeupVendors, studioVendors } from './homeData';

export const MOCK_SEARCH_DATA: SearchItem[] = [
  ...hallVendors.map(v => ({
    id: v.id,           // ← number → string
    name: v.name,
    region: v.region,
    cat: 'hall' as CategoryKey,
    price: 100_000,
    logo: v.logo,
    tags: ['채플', '뷔페', '50명', '지하철'],
  })),
  ...studioVendors.map(v => ({
    id: v.id,           // ← number → string
    name: v.name,
    region: v.region,
    cat: 'studio' as CategoryKey,
    price: 600_000,
    logo: v.logo,
    tags: [],
  })),
  ...makeupVendors.map(v => ({
    id: v.id,           // ← number → string
    name: v.name,
    region: v.region,
    cat: 'makeup' as CategoryKey,
    price: 1_000_000,
    logo: v.logo,
    tags: [],
  })),
];