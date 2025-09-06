// src/services/mappers/searchMappers.ts
import type { HallMeal, HallStyle } from '@/services/weddingHall.api';

const STYLE_KO_TO_API: Record<string, HallStyle> = {
  채플: 'CHAPEL',
  호텔: 'HOTEL',
  컨벤션: 'CONVENTION',
  하우스: 'HOUSE',
};

const MEAL_KO_TO_API: Record<string, HallMeal> = {
  뷔페: 'BUFFET',
  코스: 'COURSE',
  한상차림: 'ONE_TABLE_SETTING',
  테이블세팅: 'TABLE_SETTING', // 백엔드 enum 확인 필요
};

// ✅ 배열로 변환 (선택 X면 undefined)
export function mapStyleKoToApi(arr: readonly string[] | string[]): HallStyle[] | undefined {
  const out = (arr ?? []).map((k) => STYLE_KO_TO_API[k]).filter(Boolean) as HallStyle[];
  return out.length ? out : undefined;
}
export function mapMealKoToApi(arr: readonly string[] | string[]): HallMeal[] | undefined {
  const out = (arr ?? []).map((k) => MEAL_KO_TO_API[k]).filter(Boolean) as HallMeal[];
  return out.length ? out : undefined;
}

export function parseGuestKo(s?: string | null): number | undefined {
  if (!s) return undefined;
  const n = Number(String(s).replace(/\D/g, ''));
  return Number.isFinite(n) ? n : undefined;
}