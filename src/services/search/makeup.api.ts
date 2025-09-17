import { http, type ApiEnvelope } from '@/services/http';
import { mapSearchResponse, type VendorRes } from '@/services/mappers/searchMapper';
import type { SearchResult } from '@/types/search';

export type MakeupSearchReq = {
  regionCode?: string[] | null;
  price?: number | null;
  makeupStyle?: string[] | null;
  isStylistDesignationAvailable?: boolean | null;
  hasPrivateRoom?: boolean | null;
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

  const qs = new URLSearchParams();
  if (body.regionCode?.length) qs.set('regionCode', body.regionCode.join(','));
  if (body.price != null && body.price > 0) qs.set('price', String(body.price));
  if (body.makeupStyle?.length) qs.set('makeupStyle', body.makeupStyle.join(','));
  if (body.isStylistDesignationAvailable != null)
    qs.set('isStylistDesignationAvailable', String(body.isStylistDesignationAvailable));
  if (body.hasPrivateRoom != null)
    qs.set('hasPrivateRoom', String(body.hasPrivateRoom));

  qs.set('page', String(page));
  qs.set('size', String(size));

  const url = `/v1/vendor/conditionSearch/makeup?${qs.toString()}`;
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