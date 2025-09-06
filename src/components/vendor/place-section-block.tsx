// src/app/vendor/[id]/place-section-block.tsx
'use client';

import type { PlaceSection } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function PlaceSectionBlock({ section }: { section: PlaceSection }) {
  const [ref, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', loop: false });
  const [index, setIndex] = useState(0);

  // 현재 인덱스 추적
  useEffect(() => {
    if (!api) return;
    const update = () => setIndex(api.selectedScrollSnap());
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  return (
    <section className="mb-8">
      <h2 className="text-[15px] font-extrabold text-gray-900">{section.name}</h2>

      {/* 갤러리 */}
      <div
        ref={ref}
        className="relative mt-2 overflow-hidden border border-gray-200"
      >
        <div className="flex touch-pan-y">
          {section.images.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[4/3] w-full bg-gray-50">
                <Image src={src} alt={`${section.name}-${i}`} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* 인디케이터: 이미지 컨테이너 우측하단 오버레이 */}
        {section.images.length > 1 && (
          <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full px-2 py-1">
            {section.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? 'bg-white' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {!!section.description && (
        <p className="mt-3 text-[13px] leading-relaxed text-gray-700">
          {section.description}
        </p>
      )}
    </section>
  );
}