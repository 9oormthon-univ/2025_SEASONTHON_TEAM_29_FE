// src/components/common/monocules/Header.tsx
'use client';

import { cn } from '@/utills/cn';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export type HeaderProps = {
  value: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  rightSlot?: ReactNode;
  children?: ReactNode;
  maxWidthClassName?: string;
  sticky?: boolean;
};

export default function Header({
  value,
  showBack = false,
  onBack,
  className,
  rightSlot,
  children,
  maxWidthClassName = 'max-w-[420px]',
  sticky = true,
}: HeaderProps) {
  return (
    <header
      className={cn(
        sticky && 'sticky top-0 z-10 bg-white/70 backdrop-blur',
        'px-4',
        className,
      )}
    >
      <div
        className={cn(
          'relative mx-auto flex h-16 items-center justify-center',
          maxWidthClassName,
        )}
      >
        {showBack && (
          <button
            aria-label="back"
            onClick={onBack}
            className="absolute left-0 disabled:opacity-40"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        <h1 className="text-md font-medium">{value}</h1>

        {rightSlot && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>

      {children /* 예: ProgressBar 등 */}
    </header>
  );
}
