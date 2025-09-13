// src/components/vendor/VendorDetailScreen.tsx
'use client';

import Header from '@/components/common/monocules/Header';
import type { VendorDetail } from '@/types/vendor';
import { useRouter } from 'next/navigation';
import ProductSectionBlock from './ProductSectionBlock';
import VendorHero from './VendorHero';
import VendorInfo from './VendorInfo';

export default function VendorDetailScreen({ vendor }: { vendor: VendorDetail }) {
  const router = useRouter();
  return (
    <main className="mx-auto w-full max-w-[420px] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <Header
        showBack
        onBack={() => router.back()}
        value={`${vendor.vendorName}`}
      />

      <VendorHero src={vendor.repMediaUrl} alt={vendor.vendorName} />

      <VendorInfo
        vendorName={vendor.vendorName}
        vendorType={vendor.vendorType}
        fullAddress={vendor.fullAddress}
        phoneNumber={vendor.phoneNumber}
        kakaoMapUrl={vendor.kakaoMapUrl}
      />

      {!!vendor.description && (
        <section className="px-4">
          <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-gray-700">
            {vendor.description}
          </p>
        </section>
      )}

      {/* 상품 섹션들 */}
      <div className="px-4 pb-10 mt-6">
        {vendor.products.map((p) => (
          <ProductSectionBlock key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}