// src/services/tours.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { DressTourItem, ToursBundle, TourStatus } from '@/types/tour';

/** 공통 페이징 */
type Paged<T> = {
  content: T[];
  totalPages: number;
  number: number;
  last: boolean;
  size: number;
  first: boolean;
  empty: boolean;
};

export type TourStatusApi = 'WAITING' | 'COMPLETE';

/* ===== 투어(드레스) ===== */
export type TourListItemApi = {
  tourId: number;
  vendorName: string;
  vendorLogoUrl: string;
  status: TourStatusApi;
  owned: boolean;
};

export type TourDetailApi = {
  tourId: number;
  vendorName: string;
  visitDateTime: string; // ISO
  status: TourStatusApi;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export type CreateTourReq = {
  vendorName: string;
  reservationDate: string; // YYYY-MM-DD
};

/** ✅ 드레스 순서 업데이트(저장 아님) */
export type UpdateDressReq = {
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

export async function getToursRaw() {
  return http<ApiEnvelope<Paged<TourListItemApi>>>('/v1/tour', { method: 'GET' });
}

export async function getTourDetail(tourId: number) {
  return http<ApiEnvelope<TourDetailApi>>(`/v1/tour/${tourId}`, { method: 'GET' });
}

/** ✅ PUT /api/v1/tour/{tourId} */
export async function updateDress(tourId: number, body: UpdateDressReq) {
  return http<ApiEnvelope<string>>(`/v1/tour/${tourId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/* ===== 투어로망 ===== */
export type TourRomanceListItemApi = {
  tourRomanceId: number;
  title: string;
  status: TourStatusApi;
  createdAt: string; // ISO
  owned: boolean;
};

export type TourRomanceDetailApi = {
  tourRomanceId: number;
  title: string;
  status: TourStatusApi;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

/** ✅ 투어로망 수정 요청 (title은 선택적으로 보낼 수 있게) */
export type UpdateRomanceReq = {
  title?: string;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export async function getTourRomanceRaw() {
  return http<ApiEnvelope<Paged<TourRomanceListItemApi>>>('/v1/tour-romance', { method: 'GET' });
}

export async function getTourRomanceDetail(tourRomanceId: number) {
  return http<ApiEnvelope<TourRomanceDetailApi>>(`/v1/tour-romance/${tourRomanceId}`, { method: 'GET' });
}

/** ✅ PUT /api/v1/tour-romance/{tourRomanceId} */
export async function updateRomance(tourRomanceId: number, body: UpdateRomanceReq) {
  return http<ApiEnvelope<string>>(`/v1/tour-romance/${tourRomanceId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/* ===== 매핑 유틸 ===== */
function mapStatus(s: TourStatusApi): TourStatus {
  return s === 'COMPLETE' ? 'COMPLETE' : 'WAITING';
}

function toDressTourItemFromList(x: TourListItemApi): DressTourItem {
  return {
    id: x.tourId,
    vendorName: x.vendorName,
    logoImageUrl: x.vendorLogoUrl,
    status: mapStatus(x.status),
    owned: x.owned,
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

function toRomanceItemFromList(x: TourRomanceListItemApi) {
  return {
    id: x.tourRomanceId,
    title: x.title,
    status: mapStatus(x.status),
    createdAt: x.createdAt,
    owned: x.owned,
  };
}

/* ===== 번들 조립 ===== */
export async function getTours(): Promise<ToursBundle> {
  const [tourRes, romanceRes] = await Promise.all([getToursRaw(), getTourRomanceRaw()]);

  const dressTour = (tourRes.data?.content ?? []).map(toDressTourItemFromList);
  const dressRomance = (romanceRes.data?.content ?? []).map(toRomanceItemFromList);

  return { dressTour, dressRomance };
}