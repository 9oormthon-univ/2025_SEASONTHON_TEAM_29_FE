'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { cn } from '@/utills/cn';

type Props = {
  target: Date | string;
  label?: string;
  className?: string;
};

function toDate(d: Date | string) {
  return d instanceof Date ? d : new Date(d);
}

export default function DdayCard({
  target,
  label = 'Wedding Day',
  className,
}: Props) {
  const dday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tgt = toDate(target);
    tgt.setHours(0, 0, 0, 0);
    const diff = Math.floor(
      (tgt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return 'D-Day';
    return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
  }, [target]);

  return (
    <div
      className={cn(
        'relative w-87 h-[138px] rounded-lg overflow-hidden',
        'bg-gradient-to-l from-red-100 to-neutral-50/40',
        className,
      )}
    >
      <Image
        src="/cake.png"
        alt="cake"
        width={84}
        height={99}
        className="absolute left-4 bottom-0"
        priority
      />
      <Image
        src="/letter.png"
        alt="letter"
        width={40}
        height={56}
        className="absolute right-4 top-[63px] rotate-[-14.11deg]"
        priority
      />

      <div className="absolute left-[129px] top-[45px] opacity-80 text-red-400 text-sm font-[var(--font-nova-slim,_Nova_Slim)] leading-normal">
        {label}
      </div>
      <div className="absolute left-[129px] top-[60px] opacity-80 text-red-400 text-3xl font-[var(--font-nova-square,_Nova_Square)] leading-normal">
        {dday}
      </div>
    </div>
  );
}
