import { http } from '@/services/http';
import type {
  ContractDetail,
  ContractSlot,
  CreateContractReq,
  CreateContractRes,
  MyContractsRes,
} from '@/types/contract';
import type { ApiResponse } from '@/types/reservation';

// 공통 페이지 타입
type Paged<T> = {
  content: T[];
  totalPages: number;
  number: number;  // 현재 페이지 (0부터)
  last: boolean;
  size: number;
  first: boolean;
  empty: boolean;
  totalElements: number;
};

// ✅ 후기 작성 가능 계약 아이템 타입
export type ReviewableContract = {
  contractId: number;
  vendorId: number;
  vendorName: string;
  logoImageUrl?: string;
};

/** 계약 가능한 슬롯 조회 */
export async function getAvailableSlots(
  productId: number,
  months: number[],
) {
  const qs = new URLSearchParams();
  qs.set('productId', String(productId));
  for (const m of months) qs.append('months', String(m));

  const res = await http<ApiResponse<ContractSlot[]>>(
    `/v1/contracts/available-slots?${qs.toString()}`,
    { method: 'GET' },
  );
  return res.data ?? [];
}

/** 계약 생성 */
export async function createContract(req: CreateContractReq) {
  const res = await http<ApiResponse<CreateContractRes>>(
    `/v1/contracts`,
    { method: 'POST', body: JSON.stringify(req) },
  );
  return res.data!;
}

/** 내 계약 목록 */
export async function getMyContracts(page = 0, size = 10) {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await http<ApiResponse<MyContractsRes>>(
    `/v1/contracts/my?${qs.toString()}`,
    { method: 'GET' },
  );
  return res.data!;
}

/** ✅ 후기 작성 가능 계약 목록 (페이지형 → {items, hasNext}) */
export async function getReviewableContracts(page = 0, size = 10): Promise<{
  items: ReviewableContract[];
  hasNext: boolean;
}> {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });

  const res = await http<ApiResponse<Paged<ReviewableContract>>>(
    `/v1/contracts/my/reviewable?${qs.toString()}`,
    { method: 'GET' },
  );

  const raw = res.data;
  const items = (raw?.content ?? []).map((r) => ({
    contractId: Number(r.contractId),
    vendorId: Number(r.vendorId),
    vendorName: String(r.vendorName),
    logoImageUrl: r.logoImageUrl ?? undefined,
  }));

  const hasNext = raw ? !raw.last : false;
  return { items, hasNext };
}

/** 계약 상세 */
export async function getContractDetail(contractId: number) {
  const res = await http<ApiResponse<ContractDetail>>(
    `/v1/contracts/${contractId}`,
    { method: 'GET' },
  );
  return res.data!;
}