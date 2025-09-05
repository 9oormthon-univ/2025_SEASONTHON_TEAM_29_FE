'use client';

import * as React from 'react';
import clsx from 'clsx';

export type CalendarToggleValue = 'event' | 'schedule';

export type CalendarToggleProps = {
  value?: CalendarToggleValue;
  defaultValue?: CalendarToggleValue;
  onChange?: (v: CalendarToggleValue) => void;
  className?: string;
  labels?: { event: string; schedule: string };
};

export default function CalendarToggle({
  value,
  defaultValue = 'event',
  onChange,
  className,
  labels = { event: '행사', schedule: '일정' },
}: CalendarToggleProps) {
  const [inner, setInner] = React.useState<CalendarToggleValue>(defaultValue);
  const selected = value ?? inner;

  const setSelected = (v: CalendarToggleValue) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  return (
    <div
      role="tablist"
      aria-label="캘린더 토글"
      className={clsx(
        'relative w-16 h-7 rounded-[100px] bg-primary-100',
        className,
      )}
    >
      <div
        className={clsx(
          'absolute inset-y-0 left-0 w-1/2 rounded-[100px] bg-primary-500',
          'transition-transform duration-200 ease-out',
          selected === 'schedule' && 'translate-x-full',
        )}
      />
      <div className="pointer-events-none relative grid h-full grid-cols-2 text-[10px] leading-normal">
        <div
          className={clsx(
            'flex items-center justify-end pr-1.5',
            selected === 'event'
              ? 'text-white font-semibold'
              : 'text-text--secondary font-medium',
          )}
        >
          {labels.event}
        </div>
        <div
          className={clsx(
            'flex items-center justify-start pl-1.5',
            selected === 'schedule'
              ? 'text-white font-semibold'
              : 'text-text--secondary font-medium',
          )}
        >
          {labels.schedule}
        </div>
      </div>

      <button
        type="button"
        role="tab"
        aria-selected={selected === 'event'}
        aria-label={labels.event}
        onClick={() => setSelected('event')}
        className="absolute inset-y-0 left-0 w-1/2 rounded-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60"
      />
      <button
        type="button"
        role="tab"
        aria-selected={selected === 'schedule'}
        aria-label={labels.schedule}
        onClick={() => setSelected('schedule')}
        className="absolute inset-y-0 right-0 w-1/2 rounded-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60"
      />
    </div>
  );
}
