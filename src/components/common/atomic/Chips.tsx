'use client';

import clsx from 'clsx';
import * as React from 'react';

type ChipSize = 'sm' | 'lg';
type ChipVariant = 'default' | 'variant3';

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ChipSize;
  variant?: ChipVariant;
  selected?: boolean;
  className?: string;
};

export default function Chips({
  size = 'sm',
  variant = 'default',
  selected = false,
  className,
  children,
  ...rest
}: ChipProps) {
  const base =
    'inline-flex items-center justify-center rounded-[100px] overflow-hidden cursor-pointer transition';

  const sizeClass =
    size === 'sm'
      ? 'px-3.5 text-sm font-normal leading-loose'
      : 'px-6 py-1.5 text-sm font-normal leading-loose';

  const frameClass = selected
    ? 'bg-primary-200 outline outline-2 outline-offset-[-1px] outline-primary-500'
    : variant === 'variant3'
      ? 'bg-primary-200 outline outline-2 outline-offset-[-1px] outline-primary-500'
      : 'bg-transparent outline outline-1 outline-offset-[-1px] outline-box-line';

  const textClass = 'text-foreground';

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={clsx(base, sizeClass, frameClass, textClass, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
