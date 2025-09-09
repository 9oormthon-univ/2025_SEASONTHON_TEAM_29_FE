// src/lib/vendorKey.ts
import type { VendorItem } from '@/types/vendor';

export function vendorKey(v: VendorItem) {
  // 프로젝트에 맞게 가장 안정적인 식별자 사용
  return String(v.id); // 지점 개념 있으면 `${v.id}:${v.branchId}` 등으로
}