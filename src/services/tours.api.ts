import { http, type ApiEnvelope } from '@/services/http';
import type { DressTourItem, ToursBundle } from '@/types/tour';

/** ── Swagger 타입 ───────────────────────── */
export type TourStatusApi = 'WAITING' | 'DONE';

export type TourListItemApi = {
  id: number;
  status: TourStatusApi;
  memberId: number;
  vendorId: number;
};

export type TourDetailApi = {
  id: number;
  status: TourStatusApi;
  memberId: number;
  vendorId: number;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

export type CreateTourReq = {
  vendorName: string;           // 예: "웨딧드레스 강남점"
  reservationDate: string;      // YYYY-MM-DD
};

export type SaveDressReq = {
  tourId: number;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
};

/** ── API 호출 ──────────────────────────── */
export async function createTour(body: CreateTourReq) {
  // POST /api/v1/Tour
  return http<ApiEnvelope<string>>('/v1/tour', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function saveDress(body: SaveDressReq) {
  // POST /api/v1/Tour/save_dress
  return http<ApiEnvelope<string>>('/v1/tour/save_dress', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getToursRaw() {
  // GET /api/v1/Tour
  return http<ApiEnvelope<TourListItemApi[]>>('/v1/tour', { method: 'GET' });
}

export async function getTourDetail(tourId: number) {
  // GET /api/v1/Tour/{tourId}/detail
  return http<ApiEnvelope<TourDetailApi>>(`/v1/tour/${tourId}/detail`, { method: 'GET' });
}

/** ── 앱에서 쓰는 번들 형태로 매핑 ────────── */
function toDressTourItem(x: TourListItemApi): DressTourItem {
  // 백이 vendorName/로고를 아직 안 줘서, 임시 라벨 구성
  return {
    id: String(x.id),
    brandName: `업체 #${x.vendorId}`,
    logoUrl: '',                       // 나중에 백 응답 확장되면 교체
    status: x.status === 'DONE' ? 'DONE' : 'PENDING',
  };
}

export async function getTours(): Promise<ToursBundle> {
  const res = await getToursRaw();
  const list = res.data ?? [];

  // 현재 스펙에선 드레스 투어만 존재 → dressRomance는 빈 배열로
  const dressTour = list.map(toDressTourItem);
  return { dressTour, dressRomance: [] };
}