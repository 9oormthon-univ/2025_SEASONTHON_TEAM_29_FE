// src/services/vendor.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { PlaceSection, VendorAddress, VendorDetail, VendorHallDetails, VendorItem } from '@/types/vendor';

/** ====== 공통 타입 ====== */
export type VendorCategory = 'WEDDING_HALL' | 'STUDIO' | 'DRESS' | 'MAKEUP';

type ApiVendorListItem = {
  vendorId: number;
  name: string;
  category: VendorCategory;
  dong?: string;                  // 지역(동)
  logoImageUrl?: string;          // S3 presigned URL
  totalReviewCount?: number;
  averageRating?: number;
};

type ApiVendorListPage = {
  content: ApiVendorListItem[];
  number: number;           // 현재 페이지
  size: number;             // 페이지 크기
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

/** API -> UI 카드 타입 매핑 */
function mapListItem(v: ApiVendorListItem): VendorItem {
  return {
    id: v.vendorId,
    name: v.name,
    region: v.dong ?? '-',                     // UI에서 쓰는 지역 문자열
    rating: Number(v.averageRating ?? 0),
    count: Number(v.totalReviewCount ?? 0),
    logo: v.logoImageUrl ?? '/logos/placeholder.png',
    href: `/vendor/${v.vendorId}`,
    price: 0,                                  // 백엔드가 없으면 0으로
  };
}

/** 카테고리별 목록 조회 */
export async function getVendorsByCategory(
  category: VendorCategory,
  page = 0,
  size = 10,
  opts?: { skipAuth?: boolean }
): Promise<{ items: VendorItem[]; page: number; size: number; hasNext: boolean }> {
  const res = await http<ApiEnvelope<ApiVendorListPage>>(
    `/v1/vendor/list/${category}?page=${page}&size=${size}`,
    { method: 'GET', skipAuth: opts?.skipAuth }
  );

  const data = res?.data;
  const content = data?.content ?? [];
  return {
    items: content.map(mapListItem),
    page: data?.number ?? page,
    size: data?.size ?? size,
    hasNext: typeof data?.last === 'boolean' ? !data.last : false,
  };
}

/* ====== (기존) 상세 API 유지 ====== */

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
  if (!res.data) throw new Error('업체 상세 데이터가 없습니다.');
  return mapToVendorDetail(res.data);
}