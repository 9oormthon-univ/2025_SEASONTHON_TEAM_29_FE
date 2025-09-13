// src/components/common/atomic/VendorCard.tsx
'use client';

import type { VendorListItem } from '@/types/vendor';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  item: VendorListItem;     // ✅ 기존 VendorItem → VendorListItem
  href: string;
  showPrice?: boolean;      // 사용 중이면 유지
};

export default function VendorCard({ item, href, showPrice = false }: Props) {
  const {
    vendorId,
    vendorName,
    logoImageUrl,
    regionName,
    averageRating,
    reviewCount,
  } = item;

  return (
    <Link
      href={href}
      className="block p-3 rounded-xl bg-white shadow-sm border border-gray-100"
      aria-label={`${vendorName} 상세보기`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={logoImageUrl || '/logos/placeholder.png'}
          alt={vendorName}
          fill
          sizes="160px"
          className="object-contain"
          priority={false}
        />
      </div>

      <div className="mt-2">
        <div className="text-sm font-semibold truncate">{vendorName}</div>
        <div className="mt-0.5 text-xs text-gray-500 truncate">
          {regionName ?? '-'}
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
          <span className="font-medium">
            {averageRating != null ? averageRating.toFixed(1) : '0.0'}
          </span>
          <span>· 리뷰 {reviewCount ?? 0}</span>
        </div>

        {showPrice && (
          <div className="mt-1 text-xs text-gray-700">가격 정보 준비중</div>
        )}
      </div>
    </Link>
  );
}