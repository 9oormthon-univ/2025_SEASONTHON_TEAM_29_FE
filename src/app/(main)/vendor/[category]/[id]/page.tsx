'use client';

import VendorDetailScreen from '@/components/vendor/VendorDetailScreen';
import { vendorDetails } from '@/data/vendorDetails';
import { useParams } from 'next/navigation';

export default function VendorDetailPage() {
  const { id } = useParams();
  const vendor = vendorDetails.find(v => v.id === Number(id));

  if (!vendor) {
    return (
      <main className="mx-auto w-full max-w-[420px] h-dvh grid place-items-center">
        <div className="text-sm text-gray-500">업체를 찾을 수 없습니다.</div>
      </main>
    );
  }

  return <VendorDetailScreen vendor={vendor} />;
}