'use client';

import Section from '@/components/common/Section';
import type { StoryItem } from '@/types/story';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

export default function StoryWideCarousel({ items }: { items: StoryItem[] }) {
  const [ref] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });

  return (
    <Section
      title="따끈따끈, 신규 스토리"
      onMore={() => {}}
      bleed="viewport"
      className="mt-8"
    >
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-3 px-4 touch-pan-y">
          {items.map((s, i) => (
            <a
              key={s.id}
              href={`/stories/${s.id}`}
              className={`pl-1 min-w-0 flex-[0_0_75%] ${
                i === items.length - 1 ? 'mr-4' : ''
              }`}
            >
              <article className="flex overflow-hidden rounded-xl border border-gray-200 bg-white py-2 px-3">
                <div className="mt-5 flex-1">
                  <div className="text-xs text-gray-400">
                    {s.category.map((c, idx) => (
                      <span key={idx} className="mr-1">
                        #{c}
                      </span>
                    ))}
                  </div>
                  <h3 className="line-clamp-2 text-[14px] font-extrabold text-gray-900">
                    {s.title}
                  </h3>
                </div>

                {/* 이미지 대신 플레이스홀더 */}
                <div className="relative mx-1 h-[60px] w-[60px] overflow-hidden rounded-md">
                  <Image src={s.img} width={60} height={60} alt="" />
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
