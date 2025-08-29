'use client';

import * as React from 'react';
import clsx from 'clsx';

type LabelSize = 'sm' | 'lg';
type LabelVariant = 'default' | 'variant3';

export type LabelProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: LabelSize;
  variant?: LabelVariant;
  className?: string;
};
export default function Label({
  size = 'sm',
  variant = 'default',
  className,
  children,
  ...rest
}: LabelProps) {
  const base =
    'inline-flex items-center justify-center rounded-[100px] overflow-hidden';

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
    <div
      className={clsx(base, sizeClass, frameClass, textClass, className)}
      {...rest}
    >
      {children}
    </div>
  );
}
