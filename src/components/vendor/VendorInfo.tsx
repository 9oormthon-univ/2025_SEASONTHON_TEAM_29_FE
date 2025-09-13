// src/components/vendor/VendorInfo.tsx
'use client';

import type { VendorCategory } from '@/types/vendor';
import { MapPin, Phone } from 'lucide-react';

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  WEDDING_HALL: '웨딩홀',
  DRESS: '드레스',
  STUDIO: '스튜디오',
  MAKEUP: '메이크업',
};

export default function VendorInfo({
  vendorName,
  vendorType,
  fullAddress,
  phoneNumber,
  kakaoMapUrl,
}: {
  vendorName: string;
  vendorType: VendorCategory;
  fullAddress: string;
  phoneNumber?: string;
  kakaoMapUrl?: string;
}) {
  const tel = phoneNumber?.replaceAll('-', '');
  const categoryLabel = CATEGORY_LABELS[vendorType];

  return (
    <section className="px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="mt-0.5 line-clamp-2 text-lg font-extrabold tracking-tight">
            [{categoryLabel}] {vendorName}
          </h1>
          <p className="mt-1 text-[12px] text-gray-600">{fullAddress}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!!kakaoMapUrl && (
            <a
              href={kakaoMapUrl}
              target="_blank"
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white active:scale-95"
              aria-label="지도 열기"
            >
              <MapPin className="h-4 w-4 text-gray-700" />
            </a>
          )}
          {!!tel && (
            <a
              href={`tel:${tel}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white active:scale-95"
              aria-label="전화하기"
            >
              <Phone className="h-4 w-4 text-gray-700" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}