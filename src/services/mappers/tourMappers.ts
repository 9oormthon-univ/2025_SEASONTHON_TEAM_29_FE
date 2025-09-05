// src/services/mappers/tourMappers.ts
import { dressLines, dressMaterials, dressNecklines } from '@/data/dressOptions';

/** ───────────── 소재 (단일 선택) ─────────────
 * 서버 materialOrder: 1,2,3... (없으면 0)
 * 클라 materials: string 하나 선택(현 구조상 배열이지만 단일만 유효)
 */
export function materialOrderFromName(name?: string | null): number {
  if (!name) return 0;
  const idx = dressMaterials.findIndex((m) => m === name);
  // 1-based: 없으면 0, 찾으면 idx+1
  return idx >= 0 ? idx + 1 : 0;
}

export function materialNameFromOrder(order?: number | null): string | null {
  if (!order || order <= 0) return null;
  const name = dressMaterials[order - 1];
  return name ?? null;
}

/** ───────────── 넥라인 (단일) ─────────────
 * 서버 neckLineOrder: 1,2,3...
 * 클라 neck: item.id 기반
 */
export function neckOrderFromId(neckId?: string | number | null): number {
  if (neckId == null) return 0;
  const idx = dressNecklines.findIndex((n) => String(n.id) === String(neckId));
  return idx >= 0 ? idx + 1 : 0; // 1-based
}

export function neckIdFromOrder(order?: number | null): string | null {
  if (!order || order <= 0) return null;
  const item = dressNecklines[order - 1];
  return item ? String(item.id) : null;
}

/** ───────────── 라인 (단일) ─────────────
 * 서버 lineOrder: 1,2,3...
 * 클라 line: item.id 기반
 */
export function lineOrderFromId(lineId?: string | number | null): number {
  if (lineId == null) return 0;
  const idx = dressLines.findIndex((l) => String(l.id) === String(lineId));
  return idx >= 0 ? idx + 1 : 0; // 1-based
}

export function lineIdFromOrder(order?: number | null): string | null {
  if (!order || order <= 0) return null;
  const item = dressLines[order - 1];
  return item ? String(item.id) : null;
}