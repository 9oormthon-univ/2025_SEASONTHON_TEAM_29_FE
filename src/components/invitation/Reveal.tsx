'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type Effect = 'fade-up' | 'fade';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  effect?: Effect;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  once = false,
  effect = 'fade-up',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (shown && once) return;
            if (timerRef.current) window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => setShown(true), delay);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            if (timerRef.current) window.clearTimeout(timerRef.current);
            setShown(false);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, once]);

  const effectCls =
    effect === 'fade-up'
      ? shown
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-6'
      : shown
        ? 'opacity-100'
        : 'opacity-0';

  return (
    <div
      ref={ref}
      className={clsx(
        effect === 'fade-up'
          ? 'transition-all duration-700 ease-out will-change-transform'
          : 'transition-opacity duration-700 ease-out',
        'motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0',
        effectCls,
        className,
      )}
      style={{ visibility: shown ? 'visible' : 'hidden' }}
    >
      {children}
    </div>
  );
}
