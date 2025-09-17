// src/types/contract.ts
export type ContractSlot = {
  availableSlotId: number;
  productId: number; // ✅ cart API 요청에 필요
  startTime: string; // ISO8601
  price: number;
  productType: string;
  details?: {
    expectedGuests?: number;
    expectedMealCost?: number;
    dressStyle?: string;
    dressOrigin?: string;
  };
};
export type CreateContractReq = {
  availableSlotId: number;
};

export type CreateContractRes = {
  contractId: number;
};

export type ContractSummary = {
  contractId: number;
  vendorId: number;
  vendorName: string;
  productName: string;
  regionName: string;
  logoImageUrl: string;
};

export type ContractGroup = {
  executionDate: string;
  contracts: ContractSummary[];
};

export type MyContractsRes = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  isLast: boolean;
  contractGroups: ContractGroup[];
};

export type ContractDetail = {
  contractId: number;
  executionDateTime: string; // ISO string
  repImageUrl?: string;
  vendorAddress: string;
  vendorName: string;
};