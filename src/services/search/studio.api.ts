import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type StudioSearchReq = {
  regionCode: string[];
  price: number;
  studioStyle: string[];
  specialShot?: string[];
  iphoneSnap: boolean;
  page?: number;
  size?: number;
};

export type StudioSearchRes = VendorRes[];

export async function searchStudios(
  body: StudioSearchReq,
  opts?: { skipAuth?: boolean },
): Promise<SearchResult> {
  const page = body.page ?? 0;
  const size = body.size ?? 12;

  const url = `/v1/vendor/conditionSearch/studio?page=${page}&size=${size}`;
  const res = await http<ApiEnvelope<StudioSearchRes>>(url, {
    method: 'GET',
    skipAuth: opts?.skipAuth,
  });

  const data = res.data ?? [];
  return {
    items: mapSearchResponse(data, 'studio'),
    pageSize: size,
    totalElements: data.length,
    totalPages: 1,
  };
}