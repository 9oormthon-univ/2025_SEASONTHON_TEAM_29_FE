// src/services/vendor.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { PlaceSection, VendorAddress, VendorDetail, VendorHallDetails } from '@/types/vendor';

type ApiVendorDetail = {
  vendorId: number;
  name: string;
  phoneNumber?: string;
  category: string;
  description?: string;
  address?: VendorAddress;
  details?: VendorHallDetails;
  mainImageUrl?: string;
  imageGroups?: Array<{
    groupTitle: string;
    groupDescription?: string;
    groupSortOrder: number;
    images: Array<{ imageUrl: string; sortOrder: number }>;
  }>;
};

function mapToVendorDetail(api: ApiVendorDetail): VendorDetail {
  const places: PlaceSection[] =
    (api.imageGroups ?? [])
      .sort((a, b) => (a.groupSortOrder ?? 0) - (b.groupSortOrder ?? 0))
      .map(g => ({
        name: g.groupTitle,
        description: g.groupDescription,
        images: (g.images ?? [])
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map(i => i.imageUrl),
      }));

  const parts: string[] = [];
  if (api.details?.hallSeats) parts.push(`웨딩홀 ${api.details.hallSeats}석`);
  if (api.details?.banquetSeats) parts.push(`피로연장 ${api.details.banquetSeats}석 보유`);

  return {
    id: api.vendorId,
    title: api.name,
    category: api.category,
    description: api.description,
    phone: api.phoneNumber,
    mapurl: api.address?.kakaoMapUrl,
    mainImage: api.mainImageUrl ?? '',
    detail: parts.join(', ') || undefined,
    places,
    address: api.address,
    details: api.details,
  };
}

export async function getVendorDetail(
  vendorId: number,
  opts?: { skipAuth?: boolean }
): Promise<VendorDetail> {
  const res = await http<ApiEnvelope<ApiVendorDetail>>(
    `/v1/vendor/${vendorId}`,
    { method: 'GET', skipAuth: opts?.skipAuth }
  );

  if (!res.data) {
    throw new Error('업체 상세 데이터가 없습니다.');
  }
  return mapToVendorDetail(res.data);
}