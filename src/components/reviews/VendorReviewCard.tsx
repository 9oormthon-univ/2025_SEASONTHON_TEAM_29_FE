// src/components/reviews/VendorReviewCard.tsx
'use client';

import ImageLightbox from '@/components/reviews/ImageBox';
import type { RawVendorReview } from '@/services/vendor-review.api';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export default function VendorReviewCard({ r }: { r: RawVendorReview }) {
  const [lb, setLb] = useState<{ open: boolean; i: number }>({ open: false, i: 0 });

  const date = useMemo(() => {
    const d = new Date(r.createdAt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  }, [r.createdAt]);

  const content = useMemo(() => {
    if (r.content?.trim()) return r.content.trim();
    const parts = [r.contentBest?.trim(), r.contentWorst?.trim()].filter(Boolean);
    return parts.join('\n\n');
  }, [r]);

  const images = r.imageUrls ?? [];

  return (
    <article className="border-t pt-6 first:border-t-0">
      {/* header */}
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-100" />
          <span className="text-sm text-text--default">{r.writerName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{date}</span>
          <button className="underline underline-offset-2">신고하기</button>
        </div>
      </div>

      {/* images */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.slice(0, 9).map((src, i) => (
            <button
              key={i}
              type="button"
              className="relative aspect-square overflow-hidden rounded-lg"
              onClick={() => setLb({ open: true, i })}
            >
              <Image src={src} alt={`review-img-${i + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}

      {/* ring chip */}
      <div className="mt-3 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-[11px] text-primary-700">
        웨딧링 {Math.round(r.rating)}개
      </div>

      {/* body */}
      {content && <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed">{content}</p>}

      {lb.open && (
        <ImageLightbox images={images} startIndex={lb.i} onClose={() => setLb({ open: false, i: 0 })} />
      )}
    </article>
  );
}