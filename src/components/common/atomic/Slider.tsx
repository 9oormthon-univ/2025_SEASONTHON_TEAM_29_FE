'use client';

import { useState } from 'react';
import DotUnit from './DotUnit';

interface SliderProps {
  total: number;
  initialIndex?: number;
}

export default function Slider({ total, initialIndex = 0 }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {Array.from({ length: total }).map((_, i) => (
          <DotUnit key={i} isActive={i === activeIndex} />
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <button
          onClick={prev}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Prev
        </button>
        <button
          onClick={next}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
