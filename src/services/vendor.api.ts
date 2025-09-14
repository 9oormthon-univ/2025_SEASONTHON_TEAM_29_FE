import { http } from '@/services/http';
import type {
  ApiEnvelope,
  CreateProductRequest,
  CreateVendorRequest,
  PageResponse,
  VendorCategory,
  VendorDetail,
  VendorListItem,
  VendorProductDetail,
} from '@/types/vendor';

/** 목록 조회 (배너/카테고리 공용) */
export async function getVendorsByCategory(
  category: VendorCategory,
  page = 0,
  size = 10,
  opts?: { skipAuth?: boolean }
): Promise<PageResponse<VendorListItem>> {
  const res = await http<ApiEnvelope<PageResponse<VendorListItem>>>(
    `/v1/vendor/vendors?vendorType=${category}&page=${page}&size=${size}`,
    { method: 'GET', skipAuth: opts?.skipAuth }
  );
  if (!res.data) throw new Error('업체 목록을 불러오지 못했습니다.');
  return res.data;
}

/** 업체 상세 */
export async function getVendorDetail(
  vendorId: number,
  opts?: { skipAuth?: boolean }
): Promise<VendorDetail> {
  const res = await http<ApiEnvelope<VendorDetail>>(
    `/v1/vendor/${vendorId}`,
    { method: 'GET', skipAuth: opts?.skipAuth }
  );
  console.log(res);
  if (!res.data) throw new Error('업체 상세 데이터를 불러오지 못했습니다.');
  return res.data;
}

/** 상품 상세 */
export async function getProductDetail(
  productId: number,
  opts?: { skipAuth?: boolean }
): Promise<VendorProductDetail> {
  const res = await http<ApiEnvelope<VendorProductDetail>>(
    `/v1/vendor/product/${productId}`,
    { method: 'GET', skipAuth: opts?.skipAuth }
  );
  if (!res.data) throw new Error('상품 상세 데이터를 불러오지 못했습니다.');
  return res.data;
}

/** 신규 업체 생성 */
export async function createVendor(
  body: CreateVendorRequest
): Promise<string> {
  const res = await http<ApiEnvelope<string>>(`/v1/vendor`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.data) throw new Error('업체 생성 실패');
  return res.data;
}

/** 신규 상품 생성 (카테고리별 DU로 any 없이 안전) */
export async function createProduct(
  vendorId: number,
  body: CreateProductRequest
): Promise<string> {
  const res = await http<ApiEnvelope<string>>(
    `/v1/vendor/${vendorId}/product`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );
  if (!res.data) throw new Error('상품 생성 실패');
  return res.data;
}