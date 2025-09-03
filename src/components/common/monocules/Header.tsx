// src/components/common/monocules/Header.tsx
'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

export type HeaderProps = {
  value: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  /** 우측에 추가할 요소 */
  rightSlot?: ReactNode;
};

export default function Header({
  value,
  showBack = true,
  onBack,
  className,
  rightSlot,
}: HeaderProps) {
  return (
    <header className={clsx('relative w-full h-24 bg-background', className)}>
      {showBack && (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => (onBack ? onBack() : history.back())}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-text-secondary"
          >
            <path d="M15 18L9 12l6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium leading-10 text-foreground">
        {value}
      </div>

      {rightSlot && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-3">
          {rightSlot}
        </div>
      )}
    </header>
  );
}