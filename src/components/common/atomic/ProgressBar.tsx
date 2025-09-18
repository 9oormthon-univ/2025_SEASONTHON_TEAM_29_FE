'use client';

import clsx from 'clsx';

type BarSize = 'xs' | 'sm' | 'md' | 'lg';

type ValueModeProps = {
  value: number;
  max?: number;
  step?: never;
  total?: never;
};

type StepModeProps = {
  step: number;
  total: number;
  value?: never;
  max?: never;
};

export type ProgressBarProps = (ValueModeProps | StepModeProps) & {
  size?: BarSize;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  rounded?: boolean;
  ariaLabel?: string;
};

function isStepMode(p: ProgressBarProps): p is StepModeProps {
  return 'step' in p;
}

export default function ProgressBar(props: ProgressBarProps) {
  const {
    size = 'sm',
    className = 'w-80',
    trackClassName,
    indicatorClassName,
    rounded = true,
    ariaLabel,
  } = props;

  let pct = 0;
  let ariaMax = 100;
  let ariaNow = 0;

  if (isStepMode(props)) {
    const total: number = Math.max(0, props.total);
    const step: number = Math.max(0, Math.min(props.step, total));
    ariaMax = total;
    ariaNow = step;
    pct = total > 0 ? (step / total) * 100 : 0;
  } else {
    const max: number = Math.max(0, props.max ?? 100);
    const value: number = Math.max(0, Math.min(props.value, max));
    ariaMax = max;
    ariaNow = value;
    pct = max > 0 ? (value / max) * 100 : 0;
  }

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
      aria-valuemax={ariaMax}
      aria-valuenow={ariaNow}
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
