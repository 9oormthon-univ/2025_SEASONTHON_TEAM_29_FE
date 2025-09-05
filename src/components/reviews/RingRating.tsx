'use client';

import Image from 'next/image';
import { useState } from 'react';
import SvgObject from '../common/atomic/SvgObject';
import clsx from 'clsx';

type RingRatingProps = {
  max?: number;
  value?: number | null;
  onChange?: (value: number) => void;
  readOnly?: boolean;
};

export default function RingRating({
  max = 5,
  value,
  onChange,
  readOnly,
}: RingRatingProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(0);
  const current = isControlled ? (value ?? 0) : internalValue;

  const handleClick = (idx: number) => {
    const newValue = idx + 1;
    if (isControlled) {
      if (readOnly) return;
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className="flex gap-2" role="radiogroup" aria-label="평점">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < current;
        const isInteractive = !readOnly && (onChange != null || !isControlled);

        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={current === i + 1}
            onClick={isInteractive ? () => handleClick(i) : undefined}
            disabled={!isInteractive}
            className={clsx(
              'w-7 h-6 shrink-0 p-0 m-0 bg-transparent border-0 outline-none',
              'flex items-center justify-center select-none',
              'leading-none overflow-hidden',
              'transform-gpu !scale-100 active:!scale-100',
              'focus:outline-none focus:ring-0',
              isInteractive ? 'cursor-pointer' : 'cursor-default',
            )}
          >
            {filled ? (
              <Image
                src="/icons/PinkRing.svg"
                alt={`ring-${i + 1}`}
                width={28}
                height={24}
                className="block w-[28px] h-[24px] pointer-events-none"
              />
            ) : (
              <SvgObject
                src="/icons/GrayRing.svg"
                alt={`ring-${i + 1}`}
                width={28}
                height={24}
                className="block w-[28px] h-[24px] pointer-events-none"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
