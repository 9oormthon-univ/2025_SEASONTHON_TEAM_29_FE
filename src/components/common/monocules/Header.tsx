'use client';

import { cn } from '@/utills/cn';
import { ChevronLeft } from 'lucide-react';
import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef } from 'react';
import SvgObject from '../atomic/SvgObject';

export type HeaderProps = {
  value: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  rightSlot?: ReactNode;
  children?: ReactNode;
  maxWidthClassName?: string;
  sticky?: boolean;
  /** 배경/텍스트 커스텀 */
  bgClassName?: string;
  textClassName?: string;
};

/** ref로 높이 측정 가능하도록 forwardRef */
const Header = forwardRef(function Header(
  {
    value,
    showBack = false,
    onBack,
    className,
    rightSlot,
    children,
    maxWidthClassName = 'max-w-[420px]',
    sticky = true,
    bgClassName = 'bg-white/70',
    textClassName = 'text-black',
  }: HeaderProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <header
      ref={ref}
      className={cn(
        sticky && 'sticky top-0 z-10 backdrop-blur',
        'px-4',
        bgClassName,
        textClassName,
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
            <SvgObject
              src="/icons/arrowRight.svg"
              alt="back"
              width={28}
              height={28}
              className="rotate-180"
            />
          </button>
        )}

        <h1 className={cn('text-md font-medium', textClassName)}>{value}</h1>

        {rightSlot && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>

      {children /* 예: ProgressBar 등 */}
    </header>
  );
});

export default Header;
