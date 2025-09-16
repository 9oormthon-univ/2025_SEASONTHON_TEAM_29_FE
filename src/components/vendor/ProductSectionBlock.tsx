'use client';

import type { VendorProductSummary } from '@/types/vendor';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductSectionBlock({
  product,
  vendorId, // 🔑 vendorId를 prop으로 받도록 수정
}: {
  product: VendorProductSummary;
  vendorId: number;
}) {
  const [ref, api] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
  });
  const [index, setIndex] = useState(0);
  const router = useRouter();

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

  const handleReservation = () => {
    // 👉 vendorId + productId 모두 쿼리에 포함
    router.push(`/reservation?vendor=${vendorId}&productId=${product.id}`);
  };

  return (
    <section className="mb-8">
      <h2 className="text-[15px] font-extrabold text-gray-900">
        {product.name}
      </h2>

      <div
        ref={ref}
        className="relative mt-2 overflow-hidden border border-gray-200 rounded-md"
      >
        <div className="flex touch-pan-y">
          {product.imageUrls.map((src, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[346/237] w-full bg-gray-50">
                <Image
                  src={src}
                  alt={`${product.name}-${i}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>

        {/* ✅ 우측 하단 예약 버튼 */}
        <button
          type="button"
          onClick={handleReservation}
          className="absolute bottom-2 right-2 w-10 h-10"
        >
          <Image
            src="/icons/reservationBtn.png"
            alt="예약하기"
            fill
            className="object-contain"
          />
        </button>

        {/* ✅ 인디케이터 */}
        {product.imageUrls.length > 1 && (
          <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full px-2 py-1">
            {product.imageUrls.map((_, i) => (
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