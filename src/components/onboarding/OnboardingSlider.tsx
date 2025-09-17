'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import Lottie, { type LottieComponentProps } from 'lottie-react';
import { useCallback, useEffect, useState } from 'react';

import Art1 from '@/assets/animations/Artboard_1.json';
import Art2 from '@/assets/animations/Artboard_2.json';
import Art3 from '@/assets/animations/Artboard_3.json';

import EdgeBleed from '../common/atomic/EdgeBleed';
import Slider from '../common/atomic/Slider';

type Slide = {
  anim: LottieComponentProps['animationData'];
  title: string;
  desc?: string;
};

const slides: Slide[] = [
  { anim: Art1, title: '원하는 곳만 골라서\n비교 할 수 있게!' },
  { anim: Art2, title: '행사와 투어 일정\n공유도 자동으로!' },
  { anim: Art3, title: '한 번 뿐인 결혼식,\n이제는 웨딧과 함께해요' },
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
            {slides.map((s, i) => (
              <section key={i} className="min-w-0 flex-[0_0_100%]">
                <div className="mt-8 mb-13">
                  <h2 className="whitespace-pre-line pl-10 text-left text-[24px] font-bold leading-tight text-gray-900">
                    {s.title}
                  </h2>
                </div>

                {/* ✅ 가로폭 맞춤 + 비율 유지 */}
                <div className="relative mx-auto mt-4 mb-9 w-full max-w-[420px] aspect-[410/291]">
                  <Lottie
                    animationData={s.anim}
                    loop
                    autoplay
                    role="img"
                    aria-label={s.title.replace(/\n/g, ' ')}
                    className="absolute inset-0 w-full h-full"
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