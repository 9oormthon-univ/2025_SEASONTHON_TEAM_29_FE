// src/lib/region.ts
import mapJson from '@/generated/regions.map.json';
import treeJson from '@/generated/regions.tree.json';

export const regionMap = mapJson as Record<string, number>;
export type RegionTree = {
  name: string;
  code?: number;
  children: Record<string, RegionTree>;
};
export const regionTree = treeJson as Record<string, RegionTree>;

/** 정확 매칭: "서울특별시 강남구 역삼동" → 1168010100 */
export function resolveRegionCode(fullName: string): number | null {
  return regionMap[normalize(fullName)] ?? null;
}

/** 단계 선택 매칭 */
export function resolveByParts(opts: { sido: string; sigungu: string; eupmyeondong: string }): number | null {
  const { sido, sigungu, eupmyeondong } = opts;
  const key = normalize(`${sido} ${sigungu} ${eupmyeondong}`);
  return regionMap[key] ?? null;
}

/** 아주 가벼운 정규화 (공백 단일화) */
function normalize(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

/** 간단한 검색(부분 포함) */
export function searchRegions(query: string, limit = 20): Array<{ name: string; code: number }> {
  const q = normalize(query);
  const out: Array<{ name: string; code: number }> = [];
  for (const [name, code] of Object.entries(regionMap)) {
    if (name.includes(q)) {
      out.push({ name, code });
      if (out.length >= limit) break;
    }
  }
  return out;
}