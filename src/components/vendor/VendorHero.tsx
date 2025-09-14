'use client';

import Image from 'next/image';

export default function VendorHero({ src, alt }: { src?: string; alt: string }) {
  const url = src && src.length > 0 ? src : '/images/placeholder-hero.jpg';
  return (
<div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
  <Image
    src={url}
    alt={alt}
    fill
    className="object-contain"
    priority
  />
</div>
  );
}