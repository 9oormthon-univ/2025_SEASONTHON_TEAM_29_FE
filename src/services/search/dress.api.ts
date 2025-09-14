import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type DressSearchReq = {
  regionCode: string[];
  price: number;
  dressStyle: string[];
  dressProduction: string[];
  page?: number;
  size?: number;
};

export type DressSearchRes = VendorRes[];

export async function searchDresses(
  body: DressSearchReq,
  opts?: { skipAuth?: boolean },
): Promise<SearchResult> {
  const page = body.page ?? 0;
  const size = body.size ?? 12;

  const url = `/v1/vendor/conditionSearch/dress?page=${page}&size=${size}`;
  const res = await http<ApiEnvelope<DressSearchRes>>(url, {
    method: 'GET',
    skipAuth: opts?.skipAuth,
  });

  const data = res.data ?? [];
  return {
    items: mapSearchResponse(data, 'dress'),
    pageSize: size,
    totalElements: data.length,
    totalPages: 1,
  };
}