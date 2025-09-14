import { http } from '@/services/http';
import type {
  ContractDetail,
  ContractSlot,
  CreateContractReq,
  CreateContractRes,
  MyContractsRes,
} from '@/types/contract';
import type { ApiResponse } from '@/types/reservation';

/** 계약 가능한 슬롯 조회 */
export async function getAvailableSlots(
  productId: number,
  months: number[],
): Promise<ContractSlot[]> {
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
export async function createContract(req: CreateContractReq): Promise<CreateContractRes> {
  const res = await http<ApiResponse<CreateContractRes>>(
    `/v1/contracts`,
    { method: 'POST', body: JSON.stringify(req) },
  );
  return res.data!;
}

/** 내 계약 목록 */
export async function getMyContracts(page = 0, size = 10): Promise<MyContractsRes> {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  const res = await http<ApiResponse<MyContractsRes>>(
    `/v1/contracts/my?${qs.toString()}`,
    { method: 'GET' },
  );
  return res.data!;
}

/** 후기 작성 가능 계약 목록 */
export async function getReviewableContracts(page = 0, size = 10) {
  const qs = new URLSearchParams({ page: String(page), size: String(size) });
  return http<ApiResponse<MyContractsRes>>(
    `/v1/contracts/my/reviewable?${qs.toString()}`,
    { method: 'GET' },
  );
}

/** 계약 상세 */
export async function getContractDetail(contractId: number): Promise<ContractDetail> {
  const res = await http<ApiResponse<ContractDetail>>(
    `/v1/contracts/${contractId}`,
    { method: 'GET' },
  );
  return res.data!;
}