'use client';

import Section from '@/components/common/Section';
import type { VendorItem } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import VendorCard from '../common/atomic/VendorCard';

export default function VendorSquareCarousel({
  title,
  items,
}: {
  title: string;
  items: VendorItem[];
}) {
  const [ref] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  return (
    <Section title={title} onMore={() => {}} bleed="viewport" className='mt-8'>
      <div ref={ref} className="overflow-hidden">
        {/* 트랙 양끝 패딩 + 슬라이드 간격 */}
        <div className="flex touch-pan-y px-4">
          {items.map((v) => (
            <div key={v.id} className="min-w-0 flex-[0_0_35%]">
              <VendorCard item={v} href={v.href} showPrice={false} />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}