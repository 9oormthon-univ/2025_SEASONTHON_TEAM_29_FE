// src/service/mypageUtils.ts
import type { MyReservation, ReservationApiItem, VendorItem } from '@/types/mypage';

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

export const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : typeof e === 'string' ? e : '요청에 실패했어요.';

export const labelFromISODate = (iso: string) => {
  // 안전 처리
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const [, , mm, dd] = m;
  return `${Number(mm)}월 ${Number(dd)}일`;
};

export const toYMD = (d: Date) => {
  d.setHours(0, 0, 0, 0);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};

export function resolveWeddingTarget(w?: number | string): string | undefined {
  if (!w && w !== 0) return undefined;
  if (typeof w === 'string') return /^\d{4}-\d{2}-\d{2}$/.test(w) ? w : undefined;
  if (typeof w === 'number' && Number.isFinite(w)) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + w);
    return toYMD(d);
  }
  return undefined;
}

export const toMyReservation = (r: ReservationApiItem): MyReservation => ({
  id: Number(r.id),
  vendorId: Number(r.vendorId),
  reservationDate: String(r.reservationDate),
  reservationTime: String(r.reservationTime ?? ''),
  createdAt: String(r.createdAt ?? ''),
  updatedAt: String(r.updatedAt ?? ''),
  vendorName: r.vendorName,
  vendorLogoUrl: r.vendorLogoUrl,
  mainImageUrl: r.mainImageUrl,
  district: r.district,
  vendorCategory: r.vendorCategory,
  vendorDescription: r.vendorDescription,
});

export const pickVendorLogo = (vendor?: VendorItem, res?: MyReservation) =>
  res?.vendorLogoUrl ?? vendor?.logoUrl ?? res?.mainImageUrl ?? '/logos/placeholder.png';

export const getHasNext = (json: unknown): boolean => {
  if (!isRecord(json)) return false;
  if (typeof json.last === 'boolean') return !json.last;
  if (typeof json.number === 'number' && typeof json.totalPages === 'number')
    return json.number + 1 < json.totalPages;
  return false;
};