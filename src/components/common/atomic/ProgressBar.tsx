'use client';

import * as React from 'react';
import clsx from 'clsx';

type BarSize = 'xs' | 'sm' | 'md' | 'lg';

export type ProgressBarProps = {
  value: number;
  max?: number;
  size?: BarSize;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  rounded?: boolean;
  ariaLabel?: string;
};

export default function ProgressBar({
  value,
  max = 100,
  size = 'sm',
  className = 'w-80',
  trackClassName,
  indicatorClassName,
  rounded = true,
  ariaLabel,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = max === 0 ? 0 : (clamped / max) * 100;

  const height =
    size === 'xs'
      ? 'h-1'
      : size === 'sm'
        ? 'h-1.5'
        : size === 'md'
          ? 'h-2'
          : 'h-3';

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(pct)}
      className={clsx('relative overflow-hidden', height, className)}
    >
      <div
        className={clsx(
          'absolute inset-0 bg-gray-300/70',
          rounded && 'rounded-full',
          trackClassName,
        )}
      />
      <div
        className={clsx(
          'absolute inset-y-0 left-0 bg-primary-500 transition-[width] duration-300 ease-out',
          rounded && 'rounded-full',
          indicatorClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
