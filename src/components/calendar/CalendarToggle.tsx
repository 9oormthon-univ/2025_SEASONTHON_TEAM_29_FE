'use client';

import clsx from 'clsx';
import * as React from 'react';

export type CalendarToggleValue = 'event' | 'schedule';

export type CalendarToggleProps = {
  value?: CalendarToggleValue;                 // 컨트롤드
  defaultValue?: CalendarToggleValue;          // 언컨트롤드 초기값
  onChange?: (v: CalendarToggleValue) => void;
  className?: string;
  labels?: { event: string; schedule: string };// 레이블 커스텀
  disabled?: boolean;
};

export default function CalendarToggle({
  value,
  defaultValue = 'schedule',
  onChange,
  className,
  labels = { event: '행사', schedule: '일정' },
  disabled = false,
}: CalendarToggleProps) {
  const [inner, setInner] = React.useState<CalendarToggleValue>(defaultValue);
  const selected = value ?? inner;

  const setSelected = (v: CalendarToggleValue) => {
    if (disabled || v === selected) return;
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  return (
    <div
      role="tablist"
      aria-label="캘린더 보기 전환"
      className={clsx('relative h-7 w-16 select-none m-2', className, disabled && 'opacity-50')}
    >
      {/* 배경(연한 핑크) */}
      <div className="absolute inset-0 rounded-[100px] bg-primary-200" />

      {/* 슬라이딩 캡슐(폭 36px) */}
      <div
        className={clsx(
          'absolute top-0 h-7 w-9 rounded-[100px] bg-primary-500 transition-transform duration-200 ease-out',
          selected === 'event' ? 'left-0 translate-x-0' : 'left-0 translate-x-[28px]',
        )}
      />

      {/* 레이블 */}
      <div className="pointer-events-none relative grid h-full grid-cols-2 text-[10px] leading-none">
        <div
          className={clsx(
            'flex items-center justify-center',
            selected === 'event' ? 'font-semibold text-white' : 'font-medium text-text-secondary',
          )}
        >
          {labels.event}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center',
            selected === 'schedule' ? 'font-semibold text-white' : 'font-medium text-text-secondary',
          )}
        >
          {labels.schedule}
        </div>
      </div>

      {/* 클릭 영역(접근성) */}
      <button
        type="button"
        role="tab"
        aria-selected={selected === 'event'}
        aria-label={labels.event}
        disabled={disabled}
        onClick={() => setSelected('event')}
        className="absolute inset-y-0 left-0 w-1/2 rounded-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60"
      />
      <button
        type="button"
        role="tab"
        aria-selected={selected === 'schedule'}
        aria-label={labels.schedule}
        disabled={disabled}
        onClick={() => setSelected('schedule')}
        className="absolute inset-y-0 right-0 w-1/2 rounded-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60"
      />
    </div>
  );
}