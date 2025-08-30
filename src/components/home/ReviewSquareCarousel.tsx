'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Section from '../common/Section';

type ReviewItem = {
  id: string;
  href: string;
  category: string;
  title: string;
  rings: number;
};

const mockReviews: ReviewItem[] = [
  { id: 'r1', href: '#', category: '메이크업', title: '아펠가모 반포 이용후기', rings: 4 },
  { id: 'r2', href: '#', category: '스튜디오', title: '바로오늘이그날 후기', rings: 5 },
  { id: 'r3', href: '#', category: '드레스', title: '미르스튜디오 최고', rings: 3 },
];

export default function ReviewSquareCarousel() {
  const [ref] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
  });

  return (
    <Section title="웨딧 유저가 말해주는 솔직 리뷰" onMore={() => {}} bleed="viewport">
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-3 px-4 touch-pan-y">
          {mockReviews.map((it, i) => (
            <a
              key={it.id}
              href={it.href}
              className={`min-w-0 flex-[0_0_65%] ${
                i === mockReviews.length - 1 ? 'mr-4' : ''
              }`}
              aria-label={`${it.category} 후기: ${it.title}`}
            >
              <article className="overflow-hidden border border-gray-200 rounded-2xl bg-white">
                <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
                  <div className="absolute inset-0 grid place-items-center bg-gray-200 text-xs text-gray-600">
                    이미지 없음
                  </div>
                </div>

                <div className="p-3">
                  <span className="text-xs font-semibold text-primary-500">{it.category}</span>
                  <h3 className="line-clamp-2 text-[14px] font-extrabold text-gray-900">
                    {it.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 py-3">
                    <span className="text-xs text-gray-500">웨딧링</span>
                    {Array.from({ length: it.rings }).map((_, idx) => (
                      <Image key={idx} src={'/icons/ring.svg'} alt={"웨딧링"} width={16} height={16} />
                    ))}
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