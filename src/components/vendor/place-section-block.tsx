// src/app/vendor/[id]/place-section-block.tsx
'use client';

import type { PlaceSection } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useState } from 'react';

export default function PlaceSectionBlock({ section }: { section: PlaceSection }) {
  const [ref, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', loop: false });
  const [index, setIndex] = useState(0);

  return (
    <section className="mb-8">
      <h2 className="text-[15px] font-extrabold text-gray-900">{section.name}</h2>

      {/* 갤러리 */}
      <div ref={ref} className="mt-2 overflow-hidden rounded-xl border border-gray-200">
        <div className="flex touch-pan-y">
          {section.images.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[4/3] w-full bg-gray-50">
                <Image src={src} alt={`${section.name}-${i}`} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      {section.images.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {section.images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-gray-800' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}

      {!!section.description && (
        <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
          {section.description}
        </p>
      )}
    </section>
  );
}