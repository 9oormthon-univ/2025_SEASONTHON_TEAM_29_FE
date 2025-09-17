import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type DressSearchReq = {
  regionCode?: string[] | null;
  price?: number | null;
  dressStyle?: string[] | null;
  dressOrigin?: string[] | null;
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

  const qs = new URLSearchParams();
  if (body.regionCode?.length) qs.set('regionCode', body.regionCode.join(','));
  if (body.price != null && body.price > 0) qs.set('price', String(body.price));
  if (body.dressStyle?.length) qs.set('dressStyle', body.dressStyle.join(','));
  if (body.dressOrigin?.length) qs.set('dressOrigin', body.dressOrigin.join(','));

  qs.set('page', String(page));
  qs.set('size', String(size));

  const url = `/v1/vendor/conditionSearch/dress?${qs.toString()}`;
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