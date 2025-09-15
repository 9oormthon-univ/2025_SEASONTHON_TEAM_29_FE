// src/services/tours.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type {
  DressTourItem,
  PageApi,
  TourDetailApi,
  TourListItemApi,
  ToursBundle,
  TourStatus,
  UpdateDressReq,
} from '@/types/tour';

const BASE = '/v1/tour'; // http.ts가 '/api' prefix면 최종 '/api/v1/tour'

/** 목록(페이지네이션) */
export async function getToursPage(params?: { page?: number; size?: number; sort?: string }) {
  const search = new URLSearchParams();
  if (params?.page !== undefined) search.set('page', String(params.page));
  if (params?.size !== undefined) search.set('size', String(params.size));
  if (params?.sort) search.set('sort', params.sort);

  const qs = search.toString();
  const url = qs ? `${BASE}?${qs}` : BASE;

  return http<ApiEnvelope<PageApi<TourListItemApi>>>(url, { method: 'GET' });
}

/** 상세 */
export async function getTourDetail(tourId: number) {
  return http<ApiEnvelope<TourDetailApi>>(`${BASE}/${tourId}`, { method: 'GET' });
}

/** 기록/수정 (PUT) */
export async function updateDress(tourId: number, body: UpdateDressReq) {
  return http<ApiEnvelope<string>>(`${BASE}/${tourId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/** 삭제(옵션) — 서버가 204면 http 래퍼가 no-content 처리하는지 확인 필요 */
export async function deleteTour(tourId: number) {
  return http<ApiEnvelope<unknown>>(`${BASE}/${tourId}`, { method: 'DELETE' });
}

/** ===== 매퍼 ===== */
function toAppItem(x: TourListItemApi): DressTourItem {
  const s: TourStatus = x.status === 'COMPLETE' ? 'COMPLETE' : 'WAITING';
  return {
    id: x.tourId,
    status: s,
    vendorName: x.vendorName,
    logoImageUrl: x.vendorLogoUrl,
    owned: x.owned,
  };
}

/** 기존 컴포넌트 호환을 위한 번들 변환 */
export async function getTours(params?: { page?: number; size?: number; sort?: string }): Promise<ToursBundle> {
  const res = await getToursPage(params);
  const list = res.data?.content ?? [];
  const dressTour = list.map(toAppItem);
  return { dressTour, dressRomance: [] };
}