'use client';

import Header from '@/components/common/monocules/Header';
import PlaceSectionBlock from '@/components/vendor/place-section-block';
import type { VendorDetail } from '@/types/vendor';
import VendorActions from './VendorActions';
import VendorHero from './VendorHero';
import VendorInfo from './VendorInfo';

export default function VendorDetailScreen({ vendor }: { vendor: VendorDetail }) {
  return (
    <main className="mx-auto w-full max-w-[420px] pb-[calc(env(safe-area-inset-bottom)+24px)]">
      <Header value={vendor.title} />
      <VendorHero src={vendor.mainImage} alt={vendor.title} />
      <VendorInfo
        title={vendor.title}
        category={vendor.category}
        detail={vendor.detail}
        phone={vendor.phone}
        mapurl={vendor.mapurl}
      />

      {/* 상단 소개 문단 */}
      {!!vendor.description && (
        <section className="px-4">
          <p className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-gray-700">
            {vendor.description}
          </p>
        </section>
      )}

      <VendorActions vendorId={vendor.id} />

      {/* Places */}
      <div className="px-4 pb-10 mt-6">
        {vendor.places.map((p, i) => (
          <PlaceSectionBlock key={`${vendor.id}-${i}`} section={p} />
        ))}
      </div>
    </main>
  );
}