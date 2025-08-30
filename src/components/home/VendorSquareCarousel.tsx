'use client';

import Section from '@/components/common/Section';
import type { VendorItem } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

export default function VendorSquareCarousel({
  title,
  items,
}: {
  title: string;
  items: VendorItem[];
}) {
  const [ref] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  return (
    <Section title={title} onMore={()=>{}} bleed="viewport">
      <div ref={ref} className="overflow-hidden">
        <div className="flex px-2 touch-pan-y">
          {items.map((v) => (
            <a key={v.id} href={v.href} className="min-w-0 flex-[0_0_35%]">
              <article className="bg-white p-1.5">
                <div
                  className="relative w-full overflow-hidden rounded-xl border border-gray-200"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <Image
                    src={v.logo}
                    alt={v.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width:768px) 44vw, 320px"
                  />
                </div>

                <div className="mt-2 flex items-start gap-x-2">
                  <span className="text-[13px] leading-snug text-gray-400 shrink-0">
                    {v.region}
                  </span>

                  <span
                    className="min-w-0 text-[14px] font-semibold leading-snug text-gray-800
                              line-clamp-2 break-keep"
                  >
                    {v.name}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <Image src={'/icons/ring.svg'} alt={"웨딧링"} width={16} height={16} />
                  <span>
                    {v.rating.toFixed(1)} ({v.count})
                  </span>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}