'use client';

import type { VendorProductSummary } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProductSectionBlock({ product }: { product: VendorProductSummary }) {
  const [ref, api] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', loop: false });
  const [index, setIndex] = useState(0);

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
      <h2 className="text-[15px] font-extrabold text-gray-900">{product.name}</h2>

      <div ref={ref} className="relative mt-2 overflow-hidden border border-gray-200 rounded-md">
        <div className="flex touch-pan-y">
          {product.imageUrls.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[4/3] w-full bg-gray-50">
                <Image src={src} alt={`${product.name}-${i}`} fill className="object-cover" unoptimized />
              </div>
            </div>
          ))}
        </div>

        {product.imageUrls.length > 1 && (
          <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full px-2 py-1">
            {product.imageUrls.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/60'}`}
              />
            ))}
          </div>
        )}
      </div>

      {!!product.description && (
        <p className="mt-3 text-[13px] leading-relaxed text-gray-700 whitespace-pre-wrap">
          {product.description}
        </p>
      )}

      <p className="mt-2 text-[12px] text-gray-500">
        기본가 {product.basePrice.toLocaleString()}원
      </p>
    </section>
  );
}