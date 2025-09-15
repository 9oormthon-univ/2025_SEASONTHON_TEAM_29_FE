// src/services/mappers/tourMappers.ts
import { dressLines, dressMaterials, dressNecklines } from '@/data/dressOptions';

/** ===== 소재 ===== */
export function materialNameFromOrder(order: number): string | null {
  if (order < 0 || order >= dressMaterials.length) return null;
  return dressMaterials[order] ?? null;
}
export function materialOrderFromName(name: string | null): number {
  if (!name) return 0;
  const idx = dressMaterials.findIndex(m => m === name);
  return idx >= 0 ? idx : 0;
}

/** ===== 넥라인 ===== */
export function neckIdFromOrder(order: number): string | null {
  if (order < 0 || order >= dressNecklines.length) return null;
  const found = dressNecklines[order];
  return found ? String(found.id) : null;
}
export function neckOrderFromId(id?: string | number | null): number {
  if (id === undefined || id === null) return 0;
  const idx = dressNecklines.findIndex(n => String(n.id) === String(id));
  return idx >= 0 ? idx : 0;
}

/** ===== 라인 ===== */
export function lineIdFromOrder(order: number): string | null {
  if (order < 0 || order >= dressLines.length) return null;
  const found = dressLines[order];
  return found ? String(found.id) : null;
}
export function lineOrderFromId(id?: string | number | null): number {
  if (id === undefined || id === null) return 0;
  const idx = dressLines.findIndex(l => String(l.id) === String(id));
  return idx >= 0 ? idx : 0;
}