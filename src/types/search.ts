import type { CategoryKey } from './category';

export type SearchItem = {
  id: number;
  name: string;
  region: string;
  cat: CategoryKey;
  price: number;
  logo?: string;
  rating?: number;
  count?: number;
  tags?: string[];
};

export type SearchResult = {
  items: SearchItem[];
  pageSize: number;
  totalElements: number;
  totalPages: number;
};