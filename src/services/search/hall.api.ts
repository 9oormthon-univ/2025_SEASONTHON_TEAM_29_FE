import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type HallSearchReq = {
  regionCode: string[];
  price: number;
  hallStyle: string[];
  hallMeal: string[];
  capacity: number;
  hasParking: boolean;
  page?: number;
  size?: number;
};

export type HallSearchRes = VendorRes[];

export async function searchWeddingHalls(
  body: HallSearchReq,
  opts?: { skipAuth?: boolean },
): Promise<SearchResult> {
  const page = body.page ?? 0;
  const size = body.size ?? 12;

  const qs = new URLSearchParams();
  if (body.regionCode.length > 0) qs.set('regionCode', body.regionCode.join(','));
  qs.set('price', String(body.price));
  if (body.hallStyle.length > 0) qs.set('hallStyle', body.hallStyle.join(','));
  if (body.hallMeal.length > 0) qs.set('hallMeal', body.hallMeal.join(','));
  qs.set('capacity', String(body.capacity));
  qs.set('hasParking', String(body.hasParking));
  qs.set('page', String(page));
  qs.set('size', String(size));

  const url = `/v1/vendor/conditionSearch/weddingHall?${qs.toString()}`;
  const res = await http<ApiEnvelope<HallSearchRes>>(url, {
    method: 'GET',
    skipAuth: opts?.skipAuth,
  });

  const data = res.data ?? [];
  return {
    items: mapSearchResponse(data, 'hall'),
    pageSize: size,
    totalElements: data.length,
    totalPages: 1,
  };
}