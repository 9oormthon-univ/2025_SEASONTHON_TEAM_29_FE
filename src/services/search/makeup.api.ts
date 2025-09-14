// src/services/search/makeup.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type MakeupSearchReq = {
  regionCode: string[];
  price: number; // 원 단위
  makeupStyle: string[];
  isStylistDesignationAvailable: boolean;
  hasPrivateRoom: boolean;
  page?: number;
  size?: number;
};

export type MakeupSearchRes = VendorRes[];

export async function searchMakeups(
  body: MakeupSearchReq,
  opts?: { skipAuth?: boolean },
): Promise<SearchResult> {
  const page = body.page ?? 0;
  const size = body.size ?? 12;

  const url = `/v1/vendor/conditionSearch/makeup?page=${page}&size=${size}`;
  const res = await http<ApiEnvelope<MakeupSearchRes>>(url, {
    method: 'GET',
    skipAuth: opts?.skipAuth,
  });

  const data = res.data ?? [];
  return {
    items: mapSearchResponse(data, 'makeup'),
    pageSize: size,
    totalElements: data.length,
    totalPages: 1,
  };
}