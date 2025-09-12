'use client';

import { cn } from '@/utills/cn';

export default function LinearStepProgress({
  step,
  total = 3,
  className,
}: {
  step: number;
  total?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(step, total));
  const pct = (clamped / total) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={clamped}
      className={cn(
        'relative h-1 w-80 rounded-full bg-zinc-300 overflow-hidden',
        className,
      )}
    >
      <div
        className="absolute inset-y-0 left-0 bg-primary-500 transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
