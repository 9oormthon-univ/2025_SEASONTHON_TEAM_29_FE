// src/components/vendor/VendorHero.tsx
'use client';

import Image from 'next/image';

export default function VendorHero({ src, alt }: { src?: string; alt: string }) {
  const url = src && src.length > 0 ? src : '/images/placeholder-hero.jpg';
  return (
    <div className="relative h-60 w-full sm:h-56">
      <Image src={url} alt={alt} fill className="object-cover" priority unoptimized />
    </div>
  );
}