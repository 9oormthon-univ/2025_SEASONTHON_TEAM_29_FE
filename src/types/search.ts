export type SearchParams = {
  cat?: string | string[];
  region?: string | string[];
  price?: string;
  style?: string | string[];
  meal?: string | string[];
  guest?: string;
  trans?: string | string[];
};

import type { CategoryKey } from '@/types/category';

export type SearchItem = {
  id: number;
  name: string;
  region: string;
  cat: CategoryKey;
  price: number;
  logo?: string;
  tags?: string[];
};