import type { HallMeal, HallStyle } from '@/services/weddingHall.api';

const STYLE_KO_TO_API: Record<string, HallStyle> = {
  '채플': 'CHAPEL',
  '호텔': 'HOTEL',
  '컨벤션': 'CONVENTION',
  '하우스': 'HOUSE',
};

const MEAL_KO_TO_API: Record<string, HallMeal> = {
  '뷔페': 'BUFFET',
  '코스': 'COURSE',
  '한상차림': 'ONE',
  '테이블세팅': 'TABLE_SETTING',
};

export function mapStyleKoToApi(arr: readonly string[] | string[]): HallStyle | undefined {
  const first = arr?.[0];
  return first ? STYLE_KO_TO_API[first] : undefined;
}

export function mapMealKoToApi(arr: readonly string[] | string[]): HallMeal | undefined {
  const first = arr?.[0];
  return first ? MEAL_KO_TO_API[first] : undefined;
}

export function parseGuestKo(s?: string | null): number | undefined {
  if (!s) return undefined;
  const n = Number(String(s).replace(/\D/g, ''));
  return Number.isFinite(n) ? n : undefined;
}