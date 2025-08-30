'use client';

import clsx from 'clsx';
import * as React from 'react';

type ChipSize = 'sm' | 'lg';
type ChipVariant = 'default' | 'variant3';

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ChipSize;
  variant?: ChipVariant;
  className?: string;
};

export default function Chips({
  size = 'sm',
  variant = 'default',
  className,
  children,
  ...rest
}: ChipProps) {
  const base =
    'inline-flex items-center justify-center rounded-[100px] overflow-hidden cursor-pointer transition';

  const sizeClass =
    size === 'sm'
      ? 'px-3 text-sm font-medium leading-loose'
      : 'px-6 py-1.5 text-sm font-medium leading-loose';

  const frameClass =
    variant === 'variant3'
      ? 'bg-primary-100 outline outline-1 outline-offset-[-1px] outline-primary-300'
      : 'bg-transparent outline outline-1 outline-offset-[-1px] outline-gray-300/80';

  const textClass = 'text-foreground';

  return (
    <button
      type="button"
      className={clsx(base, sizeClass, frameClass, textClass, className)}
      {...rest}
    >
      {children}
    </button>
  );
}