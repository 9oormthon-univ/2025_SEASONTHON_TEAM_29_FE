import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type StudioSearchReq = {
  regionCode?: string[] | null;
  price?: number | null;
  studioStyle?: string[] | null;
  specialShots?: string[] | null;
  iphoneSnap?: boolean | null;
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

  const qs = new URLSearchParams();
  if (body.regionCode?.length) qs.set('regionCode', body.regionCode.join(','));
  if (body.price != null && body.price > 0) qs.set('price', String(body.price));
  if (body.studioStyle?.length) qs.set('studioStyle', body.studioStyle.join(','));
  if (body.specialShots?.length) qs.set('specialShots', body.specialShots.join(','));
  if (body.iphoneSnap != null) qs.set('iphoneSnap', String(body.iphoneSnap));

  qs.set('page', String(page));
  qs.set('size', String(size));

  const url = `/v1/vendor/conditionSearch/studio?${qs.toString()}`;
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