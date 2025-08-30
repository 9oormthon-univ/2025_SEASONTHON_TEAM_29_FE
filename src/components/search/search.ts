import { categories } from '@/data/homeData';
import type { CategoryKey } from '@/types/category';
import type { SearchItem, SearchParams } from '@/types/search';

// 유틸
const toArr = (v?: string | string[]) => (Array.isArray(v) ? v : v ? [v] : []);
export const validCat = (v?: string): CategoryKey | null =>
  categories.find(c => c.key === v)?.key ?? null;

// 쿼리 파서 (page.tsx에서 사용)
export function parseSearchParams(sp: SearchParams) {
  return {
    cat: validCat(Array.isArray(sp.cat) ? sp.cat[0] : sp.cat ?? undefined),
    areas: toArr(sp.region),
    price: Number.isFinite(Number(sp.price)) ? Number(sp.price) : 1000, // 만원 단위 상한
    styles: toArr(sp.style),
    meals: toArr(sp.meal),
    guest: typeof sp.guest === 'string' ? sp.guest : null,
    trans: toArr(sp.trans),
  } as {
    cat: CategoryKey | null;
    areas: string[];
    price: number;         // 만원 단위 상한(예: 100 → 100만원)
    styles: string[];
    meals: string[];
    guest: string | null;
    trans: string[];
  };
}

// 아이템 필터 (page.tsx에서 사용)
export function filterItems(
  items: SearchItem[],
  q: ReturnType<typeof parseSearchParams>,
) {
  const priceCap = q.price * 10_000; // 만원→원

  return items.filter((it) => {
    if (q.cat && it.cat !== q.cat) return false;
    if (q.areas.length && !q.areas.includes(it.region)) return false;
    if (it.price > priceCap) return false;

    const tags = it.tags ?? [];

    if (q.styles.length && !q.styles.every(s => tags.includes(s))) return false;
    if (q.meals.length && !q.meals.every(m => tags.includes(m))) return false;
    if (q.guest && !tags.includes(q.guest)) return false;
    if (q.trans.length && !q.trans.every(t => tags.includes(t))) return false;

    return true;
  });
}