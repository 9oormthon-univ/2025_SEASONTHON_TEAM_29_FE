'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  once = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setShown(true), delay);
            if (once) io.unobserve(e.target);
          } else if (!once) {
            setShown(false);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all duration-700 ease-out will-change-transform',
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
