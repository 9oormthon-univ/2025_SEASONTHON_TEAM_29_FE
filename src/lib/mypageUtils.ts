// src/lib/mypage.api.ts

import { http, type ApiEnvelope } from '@/services/http';
import { getHasNext, isRecord, toMyReservation } from '@/services/mypage.api';
import type { MyProfile, MyReservation, ReservationApiItem, ReviewCompany } from '@/types/mypage';

export async function fetchMyProfile(): Promise<MyProfile | null> {
  const res = await http<ApiEnvelope<MyProfile>>('/v1/member/mypage', { method: 'GET' });
  console.log(res);
  return res?.data ?? null;
}

export async function fetchMyReservations(): Promise<MyReservation[]> {
  const res = await http<ApiEnvelope<ReservationApiItem[]>>('/v1/reservation', { method: 'GET' });
  return (res?.data ?? []).map(toMyReservation);
}

type ReviewPage = {
  content: unknown[];
  totalPages: number;
  number: number;
  last: boolean;
};

function toMyReviewCard(v: unknown): ReviewCompany | null {
  if (!isRecord(v)) return null;
  const id =
    typeof v.reviewId === 'number' || typeof v.reviewId === 'string'
      ? v.reviewId
      : v.id;
  if (!id) return null;
  return {
    id: String(id),
    name: typeof v.vendorName === 'string' ? v.vendorName : `업체 #${id}`,
    district: typeof v.district === 'string' ? v.district : '-',
    imageSrc: typeof v.vendorLogoUrl === 'string' ? v.vendorLogoUrl : '/logos/placeholder.png',
    rating: { score: Number((v).myRating ?? 0) || 0 },
  };
}

export async function fetchMyReviews(page: number, size: number) {
  const res = await http<ApiEnvelope<ReviewPage>>(`/v1/review/my-reviews?page=${page}&size=${size}`, { method: 'GET' });
  const raw = res?.data;
  if (!raw) return { items: [], hasNext: false };
  const items = (raw.content ?? []).map(toMyReviewCard).filter((v): v is ReviewCompany => v !== null);
  return { items, hasNext: getHasNext(raw) };
}

export function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}