// src/lib/vendorKey.ts
import type { VendorListItem } from '@/types/vendor';

export function vendorKey(v: Pick<VendorListItem, 'vendorId'>): string {
  return String(v.vendorId);
}