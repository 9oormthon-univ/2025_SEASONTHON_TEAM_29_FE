// src/services/mappers/searchMapper.ts
import type { CategoryKey } from '@/types/category';
import type { SearchItem } from '@/types/search';

/* =========================
 * 공통: API → 리스트 카드 매핑
 * ========================= */
export type VendorRes = {
  basePrice: number;
  vendorId: number;
  vendorName: string;
  averageRating: number;
  reviewCount: number;
  logoMediaUrl?: string;
  regionName?: string;
};

export function mapSearchResponse(
  data: VendorRes[] | undefined,
  cat: CategoryKey,
): SearchItem[] {
  if (!data) return [];
  return data.map((it) => ({
    id: it.vendorId,
    name: it.vendorName,
    region: it.regionName ?? '',
    cat,
    price: it.basePrice,
    logo: it.logoMediaUrl,
    rating: it.averageRating,
    count: it.reviewCount,
  }));
}

/* =========================
 * 메이크업
 * ========================= */
export const makeupStyleLabel: Record<string, string> = {
  INNOCENT: '청순',
  ROMANTIC: '로맨틱',
  NATURAL: '내추럴',
  GLAM: '글램',
};
// 한글 → ENUM
export const makeupStyleMap: Record<string, string> =
  Object.fromEntries(Object.entries(makeupStyleLabel).map(([k, v]) => [v, k]));
// ENUM → 한글 (역맵 별칭)
export const reverseMakeupStyleMap = makeupStyleLabel;

/* =========================
 * 드레스
 * ========================= */
export const dressStyleLabel: Record<string, string> = {
  MODERN: '모던',
  CLASSIC: '클래식',
  ROMANTIC: '로맨틱',
  DANAH: '단아',
  UNIQUE: '유니크',
  HIGH_END: '하이엔드',
};
export const dressStyleMap: Record<string, string> =
  Object.fromEntries(Object.entries(dressStyleLabel).map(([k, v]) => [v, k]));
export const reverseDressStyleMap = dressStyleLabel;

export const dressProductionLabel: Record<string, string> = {
  DOMESTIC: '국내',
  IMPORTED: '수입',
};
export const dressProductionMap: Record<string, string> =
  Object.fromEntries(Object.entries(dressProductionLabel).map(([k, v]) => [v, k]));
export const reverseDressProductionMap = dressProductionLabel;

/* =========================
 * 스튜디오
 * ========================= */
export const studioStyleLabel: Record<string, string> = {
  PORTRAIT_FOCUSED: '인물중심',
  NATURAL: '자연',
  EMOTIONAL: '감성',
  CLASSIC: '클래식',
  BLACK_AND_WHITE: '흑백',
};
export const studioStyleMap: Record<string, string> =
  Object.fromEntries(Object.entries(studioStyleLabel).map(([k, v]) => [v, k]));
export const reverseStudioStyleMap = studioStyleLabel;

export const studioShotLabel: Record<string, string> = {
  HANOK: '한옥',
  UNDERWATER: '수중',
  WITH_PET: '반려동물',
};
export const studioShotMap: Record<string, string> =
  Object.fromEntries(Object.entries(studioShotLabel).map(([k, v]) => [v, k]));
export const reverseStudioShotMap = studioShotLabel;

/* =========================
 * 웨딩홀
 * ========================= */
export const hallStyleLabel: Record<string, string> = {
  HOTEL: '호텔',
  CONVENTION: '컨벤션',
  HOUSE: '하우스',
};
export const hallStyleMap: Record<string, string> =
  Object.fromEntries(Object.entries(hallStyleLabel).map(([k, v]) => [v, k]));
export const reverseHallStyleMap = hallStyleLabel;

export const hallMealLabel: Record<string, string> = {
  BUFFET: '뷔페',
  COURSE: '코스',
  SEMI_COURSE: '세미코스',
};
export const hallMealMap: Record<string, string> =
  Object.fromEntries(Object.entries(hallMealLabel).map(([k, v]) => [v, k]));
export const reverseHallMealMap = hallMealLabel;