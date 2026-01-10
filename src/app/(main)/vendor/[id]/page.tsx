// src/app/vendor/[id]/page.tsx
'use client';

import VendorDetailScreen from '@/components/vendor/VendorDetail';
import { getVendorDetail } from '@/services/vendor.api';
import type { VendorDetail } from '@/types/vendor';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VendorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('업체 ID가 없습니다.');
      setLoading(false);
      return;
    }

    const vendorId = Number(id);
    if (!Number.isFinite(vendorId)) {
      setError('잘못된 업체 ID 입니다.');
      setLoading(false);
      return;
    }

    const fetchVendor = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVendorDetail(vendorId);
        setVendor(data);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : '업체를 찾을 수 없습니다.';
        setError(errorMessage);
        console.error('[VendorDetailPage] Error:', e);
      } finally {
        setLoading(false);
      }
    };

    void fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[420px] h-dvh grid place-items-center">
        <div className="text-sm text-gray-500">업체 정보를 불러오는 중...</div>
      </main>
    );
  }

  if (error || !vendor) {
    return (
      <main className="mx-auto w-full max-w-[420px] h-dvh grid place-items-center">
        <div className="text-sm text-gray-500">
          {error || '업체를 찾을 수 없습니다.'}
        </div>
      </main>
    );
  }

  return <VendorDetailScreen vendor={vendor} />;
}