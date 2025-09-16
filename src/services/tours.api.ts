// src/services/tours.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { DressTourItem, ToursBundle, TourStatus } from '@/types/tour';

/** 서버 응답 타입 */
export type TourStatusApi = 'WAITING' | 'COMPLETE';

export type TourListItemApi = {
  id: number;
  status: TourStatusApi;
  memberId: number;
  vendorId: number;
  vendorName: string;
  vendorDescription: string;
  vendorCategory: 'WEDDING_HALL';
  logoImageUrl: string;          // presigned URL
};

export type TourDetailApi = TourListItemApi & {
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export type CreateTourReq = {
  vendorName: string;
  reservationDate: string; // YYYY-MM-DD
};

export type SaveDressReq = {
  tourId: number;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export async function createTour(body: CreateTourReq) {
  return http<ApiEnvelope<string>>('/v1/tour', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function saveDress(body: SaveDressReq) {
  console.log(body);
  return http<ApiEnvelope<string>>('/v1/tour/save_dress', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getToursRaw() {
  return http<ApiEnvelope<TourListItemApi[]>>('/v1/tour', { method: 'GET' });
}

export async function getTourDetail(tourId: number) {
  return http<ApiEnvelope<TourDetailApi>>(`/v1/tour/${tourId}/detail`, { method: 'GET' });
}

/** 상태 매핑: DONE(백) → COMPLETE(프론트) */
function mapStatus(s: TourStatusApi): TourStatus {
  return s === 'COMPLETE' ? 'COMPLETE' : 'WAITING';
}

/** 목록 → 앱 아이템 매핑 */
function toDressTourItemFromList(x: TourListItemApi): DressTourItem {
  return {
    id: x.id,
    status: mapStatus(x.status),
    vendorName: x.vendorName,
    vendorDescription: x.vendorDescription,
    vendorCategory: x.vendorCategory,
    logoImageUrl: x.logoImageUrl,
  };
}

export function mergeWithDetail(listItem: DressTourItem, detail: TourDetailApi): DressTourItem {
  return {
    ...listItem,
    materialOrder: detail.materialOrder,
    neckLineOrder: detail.neckLineOrder,
    lineOrder: detail.lineOrder,
  };
}

export async function getTours(): Promise<ToursBundle> {
  const res = await getToursRaw();
  const list = res.data ?? [];
  const dressTour = list.map(toDressTourItemFromList);
  return { dressTour, dressRomance: [] };
}