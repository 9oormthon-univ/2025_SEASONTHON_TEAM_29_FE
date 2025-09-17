'use client';

import Section from '@/components/common/Section';
import type { VendorListItem } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import VendorCard from '../common/atomic/VendorCard';

export default function VendorSquareCarousel({
  title,
  items,
}: {
  title: string;
  items: VendorListItem[];
}) {
  const [ref] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  return (
    <Section title={title} onMore={() => {}} bleed="viewport" className="mt-8">
      <div ref={ref} className="overflow-hidden">
        <div className="flex touch-pan-y px-4 gap-3">
          {items.slice(0, 5).map((v) => (
            <div key={v.vendorId} className="min-w-0 flex-[0_0_33%]">
              <VendorCard
                item={v}
                href={`/vendor/${v.vendorId}`}
                showPrice={false}
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}