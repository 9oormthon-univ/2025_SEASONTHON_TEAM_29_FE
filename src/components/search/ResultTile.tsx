// src/components/search/ResultTile.tsx
'use client';
import type { Cat } from '@/constants/categories';
import { vendorHref } from '@/utils/paths';
import Image from 'next/image';

export type ResultTileItem = {
  id: number;
  name: string;
  area: string;
  cat: Cat;         // ← 카테고리 보유
  price: number;    // 원 단위
  logo?: string;
};

export function ResultTile({ item }: { item: ResultTileItem }) {
  const priceMan = Math.round(item.price / 10_000);
  const priceKR  = new Intl.NumberFormat('ko-KR').format(priceMan);

  return (
    <a href={vendorHref(item.cat, item.id)} className="block">
      <article className="rounded-2xl bg-white p-1.5">
        <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-white" style={{ aspectRatio:'1/1' }}>
          {item.logo ? (
            <Image src={item.logo} alt={item.name} fill className="object-contain p-6" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-gray-300 text-xs">no image</div>
          )}
        </div>

        <div className="mt-2 grid grid-cols-[auto,1fr] items-start gap-x-1">
          <span className="text-[14px] text-gray-400 leading-snug">{item.area}</span>
          <span className="min-w-0 text-[14px] font-semibold leading-snug text-gray-800 line-clamp-2 break-keep">
            {item.name}
          </span>
        </div>

        <p className="mt-1 text-[12px] text-gray-700">
          {priceKR}<span className="align-top">만원~</span>
        </p>
      </article>
    </a>
  );
}