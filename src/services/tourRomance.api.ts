import { http, type ApiEnvelope } from '@/services/http';
import type { TourRomanceItem, TourStatus } from '@/types/tour';

const BASE = '/v1/tour-romance';

/** 서버 응답 원본 */
interface TourRomanceItemApi {
  tourRomanceId: number;
  title: string;
  status: 'WAITING' | 'COMPLETE';
  createdAt: string;
  owned: boolean;

  // 상세 조회 시 내려올 수도 있는 필드
  materialOrder?: number;
  neckLineOrder?: number;
  lineOrder?: number;
}

/** ===== 매퍼 ===== */
function toRomanceItem(x: TourRomanceItemApi): TourRomanceItem {
  const s: TourStatus = x.status === 'COMPLETE' ? 'COMPLETE' : 'WAITING';
  return {
    id: x.tourRomanceId,
    title: x.title,
    status: s,
    createdAt: x.createdAt,
    owned: x.owned,
    materialOrder: x.materialOrder,
    neckLineOrder: x.neckLineOrder,
    lineOrder: x.lineOrder,
  };
}

/** 목록 조회 */
export async function getTourRomanceList(params?: { page?: number; size?: number }) {
  const search = new URLSearchParams();
  if (params?.page !== undefined) search.set('page', String(params.page));
  if (params?.size !== undefined) search.set('size', String(params.size));

  const qs = search.toString();
  const url = qs ? `${BASE}?${qs}` : BASE;

  const res = await http<ApiEnvelope<{ content: TourRomanceItemApi[] }>>(url, { method: 'GET' });
  const list = res.data?.content ?? [];
  return list.map(toRomanceItem);
}

/** 상세 조회 */
export async function getTourRomanceDetail(id: number) {
  const res = await http<ApiEnvelope<TourRomanceItemApi>>(`${BASE}/${id}`, { method: 'GET' });
  return toRomanceItem(res.data as TourRomanceItemApi);
}

/** 생성 */
export async function createTourRomance(body: { title: string }) {
  return http<ApiEnvelope<string>>(BASE, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** 수정 (title + fitting 옵션) */
export async function updateTourRomance(id: number, body: {
  title?: string;
  materialOrder?: number | null;
  neckLineOrder?: number | null;
  lineOrder?: number | null;
}) {
  return http<ApiEnvelope<string>>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}