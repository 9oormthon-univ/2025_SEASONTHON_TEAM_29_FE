'use client';

import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

type Props = {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  renderer?: 'svg' | 'canvas' | 'html';
  className?: string;
};

export default function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  renderer = 'svg',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    animRef.current = lottie.loadAnimation({
      container: ref.current,
      renderer,
      loop,
      autoplay,
      path: src,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
    });
    animRef.current.setSpeed(speed);

    return () => {
      try {
        animRef.current?.destroy();
        animRef.current = null;
      } catch {}
    };
  }, [src, loop, autoplay, speed, renderer]);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
