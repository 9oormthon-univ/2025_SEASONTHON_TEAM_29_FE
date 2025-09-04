'use client';

import * as React from 'react';
import clsx from 'clsx';

export type CalendarDayType = 'dd' | 'variant2' | 'hover' | 'green';

export type CalendarDayProps = {
  day: number | string;
  weekday?: string;
  type?: CalendarDayType;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ariaLabel?: string;
};

export default function CalendarDay({
  day,
  weekday,
  type = 'dd',
  className,
  onClick,
  ariaLabel,
}: CalendarDayProps) {
  const isDD = type === 'dd';
  const isHover = type === 'hover';
  const isGreen = type === 'green';

  const wrapClass = clsx('relative w-10', isDD ? 'h-24' : 'h-16', className);
  const boxWrapClass = clsx(
    'absolute left-0.5 w-10 h-10 rounded',
    isDD ? 'top-[48px]' : 'top-[27px]',
  );

  return (
    <div
      role="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={wrapClass}
    >
      {isDD && (
        <div className="absolute left-[15px] top-0 text-text-secondary text-sm font-medium leading-normal">
          {weekday ?? ''}
        </div>
      )}

      <div
        className={clsx(
          'absolute left-[18px] text-xs font-medium leading-normal',
          isDD ? 'top-[21px]' : 'top-0',
          'text-text--default',
        )}
      >
        {day}
      </div>

      <div className={boxWrapClass}>
        <div
          className={clsx(
            'absolute inset-0 rounded',
            isHover
              ? 'bg-primary-100'
              : isGreen
                ? 'opacity-30 bg-[#78D730] border-2 border-[#357107]'
                : 'opacity-30 bg-box-line',
          )}
        />
      </div>
    </div>
  );
}
