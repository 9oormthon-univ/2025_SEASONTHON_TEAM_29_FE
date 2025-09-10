// src/components/my/ReservationsTab.tsx
'use client';

import ReservationsSection from '@/components/my/ReservationsSection';
import type { MyReservation, VendorItem } from '@/types/mypage';

export default function ReservationsTab({
  items,
  loading,
  error,
  vendorMap = {},
}: {
  items: MyReservation[];
  loading: boolean;
  error: string | null;
  vendorMap?: Record<string, VendorItem>;
}) {
  return (
    <ReservationsSection
      items={items}
      loading={loading}
      error={error}
      vendorMap={vendorMap}
    />
  );
}