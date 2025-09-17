// src/components/common/atomic/VendorCard.tsx
'use client';

import type { VendorListItem } from '@/types/vendor';
import Image from 'next/image';
import Link from 'next/link';
import SvgObject from './SvgObject';

type Props = {
  item: VendorListItem;
  href: string;
  showPrice?: boolean;
};

export default function VendorCard({ item, href }: Props) {
  const {
    vendorId: _vendorId,
    vendorName,
    logoImageUrl,
    regionName,
    averageRating,
    reviewCount,
  } = item;

  return (
    <Link
      href={href}
      className="block"
      aria-label={`${vendorName} 상세보기`}
    >
      {/* 로고 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={logoImageUrl || '/logos/placeholder.png'}
          alt={vendorName}
          fill
          sizes="160px"
          className="object-contain"
          unoptimized
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-2">
        {/* 지역 + 이름 */}
        <div className="text-sm font-semibold truncate">
          <span className="text-gray-500 mr-1">{regionName ?? '-'}</span>
          <span className="text-gray-900">{vendorName}</span>
        </div>

        {/* 별점 + 리뷰 수 */}
        <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-600">
          <SvgObject
            src="/icons/PinkRing.svg"
            alt="rating-ring"
            width={12}
            height={12}
          />
          <span className="font-medium">
            {averageRating != null ? averageRating.toFixed(1) : '0.0'}
          </span>
          <span className="text-gray-500">({reviewCount ?? 0})</span>
        </div>

        {item.minPrice && (
          <div className="mt-1 text-sm font-semibold text-gray-900">
            {item.minPrice / 10000}만원~
          </div>
        )}
      </div>
    </Link>
  );
}