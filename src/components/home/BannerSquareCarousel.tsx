'use client';
import { BannerItem } from '@/types/banner';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import EdgeBleed from '../common/atomic/EdgeBleed';

export default function BannerSquareCarousel({ items }: { items: BannerItem[] }) {
  const [, setSelected] = useState(0);
  const [ref, api] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: 'trimSnaps' },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
  }, [api, onSelect]);

  return (
    <EdgeBleed>
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-3 px-4">
          {items.map((b, i) => (
            <a key={b.id} href={b.href} className="min-w-0 flex-[0_0_92%]">
              <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '1/1' }} aria-label={`배너 ${i + 1}`}>
                <div className="absolute inset-0 bg-gray-200" />

                <div className={`absolute bottom-6 left-6 drop-shadow-md ${b.color === 'black' ? 'text-black' : 'text-white'}`}>
                  <h3 className="whitespace-pre-line text-2xl font-extrabold">{b.title}</h3>
                  <p className="pt-2 text-sm font-semibold">{b.sub}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </EdgeBleed>
  );
}