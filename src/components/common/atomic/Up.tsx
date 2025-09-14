'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utills/cn';

type Props = {
  className?: string;
};

export default function Up({ className }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="scroll to top"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center justify-center',
        'w-10 h-10 rounded-full bg-white shadow-[0px_3px_3px_0px_rgba(103,103,103,0.25)]',
        'border-[0.40px] border-box-line',
        className,
      )}
    >
      <Image
        src="/icons/up.svg"
        alt="scroll to top"
        width={14}
        height={16}
        className="w-3.5 h-4"
      />
    </button>
  );
}
