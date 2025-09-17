// src/components/home/ReviewSquareCarousel.tsx
'use client';

import { HomeReviewItem } from '@/services/review.api';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Section from '../common/Section';
import SvgObject from '../common/atomic/SvgObject';

export default function ReviewSquareCarousel({ items }: { items: HomeReviewItem[] }) {
  const [ref] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
  });

  return (
    <Section title="웨딧 유저가 말해주는 솔직 리뷰" bleed="viewport" className="mt-8">
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-3 px-4 touch-pan-y">
          {items.slice(0, 5).map((it, i) => (
            <a
              key={it.id}
              href={it.href}
              className={`min-w-0 flex-[0_0_55%] ${i === items.length - 1 ? 'mr-4' : ''}`}
              aria-label={`${it.category} 후기: ${it.title}`}
            >
              <article className="overflow-hidden border border-gray-200 rounded-xl bg-white pb-1">
                <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
                  {it.src ? (
                    <Image
                      src={it.src}
                      alt={it.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 65vw, 420px"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-gray-200 text-xs text-gray-600">
                      이미지 없음
                    </div>
                  )}
                </div>

                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-text-secondary">{it.category}</span>
                  <h3 className="line-clamp-1 text-[14px] font-extrabold text-gray-900">{it.title}</h3>

                  <div className="flex items-center gap-0.5 py-1">
                    {Array.from({ length: it.rings }).map((_, idx) => (
                      <SvgObject key={idx} src="/icons/ring.svg" alt="웨딧링" width={20} height={20} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{it.writer} | {it.date}</span>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}