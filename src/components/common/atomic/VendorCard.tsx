// src/components/common/atomic/VendorCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

type CommonItem = {
  id: number;
  name: string;
  region?: string;   // 캐러셀 데이터
  logo?: string;
  rating?: number;
  count?: number;
  href?: string;
};

export default function VendorCard({ item, href, square = true }: { item: CommonItem; href?: string; square?: boolean }) {
  const displayRegion = item.region ?? '';

  const content = (
    <article className="bg-white p-1">
      <div
        className="relative w-full overflow-hidden rounded-md border border-gray-200"
        style={square ? { aspectRatio: '1 / 1' } : undefined}
      >
        {item.logo ? (
          <Image
            src={item.logo}
            alt={item.name}
            fill
            className="object-contain p-2"
            sizes="(max-width:768px) 44vw, 320px"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs text-gray-400">이미지 없음</div>
        )}
      </div>

      <div className="mt-2 flex items-start gap-x-2">
        <span className="shrink-0 text-[13px] leading-snug text-gray-400">{displayRegion}</span>
        <span className="min-w-0 text-[14px] font-semibold leading-snug text-gray-800 line-clamp-2 break-keep">
          {item.name}
        </span>
      </div>

      {(item.rating !== undefined || item.count !== undefined) && (
        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
          <Image src="/icons/ring.svg" alt="웨딧링" width={16} height={16} />
          <span>
            {item.rating !== undefined ? item.rating.toFixed(1) : '-'}
            {item.count !== undefined ? ` (${item.count})` : ''}
          </span>
        </div>
      )}
    </article>
  );

  return href ? (
    <Link href={href} className="block min-w-0">
      {content}
    </Link>
  ) : (
    <div className="min-w-0">{content}</div>
  );
}