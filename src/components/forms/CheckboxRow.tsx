'use client';

import Check from '@/components/common/atomic/check';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

type Props = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  strong?: boolean;      // 상단 "전체 약관 동의"
  muted?: boolean;       // 선택 항목처럼 연한 스타일
  showArrow?: boolean;  
  className?: string;
};

export function CheckboxRow({
  label,
  checked,
  onChange,
  strong,
  muted,
  showArrow,
  className,
}: Props) {
  // 행 전체 클릭으로 토글(체크 컴포넌트는 디스플레이 전용)
  const toggle = React.useCallback(() => onChange(!checked), [checked, onChange]);

  const type =(checked ? 'selectedFull' : 'variant2');

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      }}
      className={clsx(
        'flex items-center justify-between py-1.5 select-none cursor-pointer',
        !muted && 'hover:bg-black/[0.02]',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Check type={type} className={'w-5 h-5'} ariaLabel={label} />
          <span
            className={clsx(
              strong
                ? 'text-[15px] text-gray-900'
                : muted
                ? 'text-sm text-gray-400'
                : 'text-sm text-gray-900',
            )}
          >
          {label}
        </span>
      </div>

      {showArrow && (
        <ChevronRight
          className={clsx('h-4 w-4', muted ? 'text-gray-300' : 'text-gray-300')}
          aria-hidden
        />
      )}
    </div>
  );
}