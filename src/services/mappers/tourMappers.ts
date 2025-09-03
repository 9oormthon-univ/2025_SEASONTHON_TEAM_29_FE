import { dressLines, dressMaterials, dressNecklines } from '@/data/dressOptions';

export function materialOrderFromNames(selected: string[]): number {
  const first = selected[0];
  if (!first) return 0;
  const idx = dressMaterials.findIndex(m => m === first);
  return idx >= 0 ? idx : 0;
}

export function neckOrderFromId(neckId: string | number | undefined): number {
  if (!neckId) return 0;
  const idx = dressNecklines.findIndex(n => String(n.id) === String(neckId));
  return idx >= 0 ? idx : 0;
}

export function lineOrderFromId(lineId: string | number | undefined): number {
  if (!lineId) return 0;
  const idx = dressLines.findIndex(l => String(l.id) === String(lineId));
  return idx >= 0 ? idx : 0;
}