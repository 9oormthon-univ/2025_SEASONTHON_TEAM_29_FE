// src/components/common/Check.tsx
'use client';

import * as React from 'react';

export type CheckType = 'default' | 'variant2' | 'selectedFull' | 'selectedLine';

export type CheckProps = {
  type?: CheckType;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ariaLabel?: string;
};

const TICK_PX = 15; 

export default function Check({
  type: checkType = 'default',
  className = '',
  onClick,
  ariaLabel,
}: CheckProps) {
  const circleClass =
    checkType === 'default'
      ? 'bg-zinc-300'
      : checkType === 'variant2'
      ? 'bg-transparent border-[1.5px] border-gray-400'
      : checkType === 'selectedFull'
      ? 'bg-primary-500'
      : 'bg-transparent border-[1.5px] border-primary-300';

  const tickClass =
    checkType === 'default'
      ? 'stroke-gray-500/70'
      : checkType === 'variant2'
      ? 'stroke-gray-400'
      : checkType === 'selectedFull'
      ? 'stroke-white'
      : 'stroke-primary-300'; 

  return (
    <div
      role="checkbox"
      aria-checked={checkType === 'selectedFull' || checkType === 'selectedLine'}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center w-6 h-6 ${className}`}
    >
      <div className={`absolute inset-0 rounded-full ${circleClass}`} />
      <svg
        viewBox="0 0 24 24"
        className="absolute"
        width={TICK_PX}
        height={TICK_PX}
        aria-hidden="true"
      >
        <path
          d="M6 12l4 4 8-10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeWidth: 1.5 }}
          className={tickClass}
        />
      </svg>
    </div>
  );
}
