'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Image, { StaticImageData } from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import calendar from '@/../public/onboarding/illus/calendar.png';
import rings from '@/../public/onboarding/illus/rings.png';
import scale from '@/../public/onboarding/illus/scale.png';
import EdgeBleed from '../common/atomic/EdgeBleed';
import Slider from '../common/atomic/Slider';

type Slide = { img: StaticImageData; title: string; desc?: string };
const slides: Slide[] = [
  { img: scale, title: '원하는 곳만 골라서\n비교 할 수 있게!' },
  { img: calendar, title: '행사와 투어 일정\n공유도 자동으로!' },
  { img: rings, title: '한 번 뿐인 결혼식,\n이제는 웨딧과 함께해요' },
];

export default function OnboardingSlider() {
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 8000, stopOnInteraction: false })],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <EdgeBleed>
      <div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y select-none">
            {' '}
            {/* ← 페이지 좌우 스크롤 완화 */}
            {slides.map((s, i) => (
              <section key={i} className="min-w-0 flex-[0_0_100%]">
                <div className="mt-8 mb-13">
                  <h2 className="whitespace-pre-line pl-10 text-left text-[24px] font-bold leading-tight text-gray-900">
                    {s.title}
                  </h2>
                </div>

                <div className="relative mx-auto mt-4 mb-9 h-[291px] w-[410px]">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-contain"
                    priority={i === 0}
                  />
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* 인디케이터 */}
        <Slider
          total={slides.length}
          index={selected}
          onChange={(i) => emblaApi?.scrollTo(i)}
        />
      </div>
    </EdgeBleed>
  );
}
