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

  const url = `/v1/vendor/conditionSearch/hall?page=${page}&size=${size}`;
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