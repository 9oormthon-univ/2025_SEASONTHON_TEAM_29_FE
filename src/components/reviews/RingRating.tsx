'use client';

import Image from 'next/image';
import { useState } from 'react';
import SvgObject from '../common/atomic/SvgObject';

type RingRatingProps = {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
};

export default function RingRating({
  max = 5,
  value: controlledValue,
  onChange,
}: RingRatingProps) {
  const [internalValue, setInternalValue] = useState(0);
  const rating = controlledValue ?? internalValue;

  const handleClick = (index: number) => {
    if (controlledValue !== undefined) return;

    const newValue = index + 1;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex gap-2">
      {controlledValue !== undefined
        ? Array.from({ length: controlledValue }).map((_, i) => (
            <div key={i} className="w-7 h-6 flex items-center justify-center">
              <Image
                src="/icons/PinkRing.svg"
                alt={`ring-${i + 1}`}
                width={28}
                height={24}
              />
            </div>
          ))
        : Array.from({ length: max }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="w-7 h-6 flex items-center justify-center focus:outline-none"
            >
              <SvgObject
                src={i < rating ? '/icons/PinkRing.svg' : '/icons/GrayRing.svg'}
                alt={`ring-${i + 1}`}
                width={28}
                height={24}
              />
            </button>
          ))}
    </div>
  );
}
