'use client';

import Image from 'next/image';

export default function VendorHero({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-60 w-full sm:h-56">
      <Image src={src} alt={alt} fill className="object-cover" priority unoptimized/>
    </div>
  );
}