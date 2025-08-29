'use client';

import * as React from 'react';
import clsx from 'clsx';

export type CalendarDayType = 'dd' | 'variant2' | 'hover';

export type CalendarDayProps = {
  day: number | string;
  weekday?: string;
  type?: CalendarDayType;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ariaLabel?: string;
  dashLen?: number;
  stroke?: number;
  radius?: number;
};

function CornerAndCenterDashes({
  className,
  dashLen = 10,
  stroke = 1.5,
  radius = 8,
}: {
  className?: string;
  dashLen?: number;
  stroke?: number;
  radius?: number;
}) {
  const w = 40;
  const h = 40;
  const inset = stroke / 2;

  const cx = w / 2;
  const cy = h / 2;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      className={clsx('absolute inset-0', className)}
      aria-hidden
    >
      <path
        d={`M ${inset} ${inset + radius} A ${radius} ${radius} 0 0 1 ${inset + radius} ${inset}`} // TL
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${w - inset - radius} ${inset} A ${radius} ${radius} 0 0 1 ${w - inset} ${inset + radius}`} // TR
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${w - inset} ${h - inset - radius} A ${radius} ${radius} 0 0 1 ${w - inset - radius} ${h - inset}`} // BR
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${inset + radius} ${h - inset} A ${radius} ${radius} 0 0 1 ${inset} ${h - inset - radius}`} // BL
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />

      <line
        x1={cx - dashLen / 2}
        y1={inset}
        x2={cx + dashLen / 2}
        y2={inset}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <line
        x1={cx - dashLen / 2}
        y1={h - inset}
        x2={cx + dashLen / 2}
        y2={h - inset}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <line
        x1={inset}
        y1={cy - dashLen / 2}
        x2={inset}
        y2={cy + dashLen / 2}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <line
        x1={w - inset}
        y1={cy - dashLen / 2}
        x2={w - inset}
        y2={cy + dashLen / 2}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CalendarDay({
  day,
  weekday,
  type = 'dd',
  className,
  onClick,
  ariaLabel,
  dashLen = 10,
  stroke = 1.5,
  radius = 8,
}: CalendarDayProps) {
  const isDD = type === 'dd';
  const isHover = type === 'hover';

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
        {isHover ? (
          <div className="absolute inset-0 rounded bg-primary-100" />
        ) : (
          <CornerAndCenterDashes
            className="text-stroke-dash/60"
            dashLen={dashLen}
            stroke={stroke}
            radius={radius}
          />
        )}
      </div>
    </div>
  );
}
