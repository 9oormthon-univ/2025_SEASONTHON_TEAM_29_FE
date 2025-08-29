'use client';

import * as React from 'react';
import clsx from 'clsx';

export type InputBadgeVariant = 'primary' | 'secondary' | 'ghost';

export type InputBadgeProps = {
  children: React.ReactNode;
  variant?: InputBadgeVariant;
  className?: string;
  as?: 'div' | 'span';
};

export default function InputBadge({
  children,
  variant = 'primary',
  className,
  as = 'div',
}: InputBadgeProps) {
  const Comp = as as unknown as React.ElementType;

  const base =
    'inline-flex items-center justify-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium leading-loose';

  const scheme =
    variant === 'primary'
      ? 'bg-primary-500 text-white'
      : variant === 'secondary'
        ? 'bg-primary-300 text-white'
        : 'bg-primary-100 text-white';

  return <Comp className={clsx(base, scheme, className)}>{children}</Comp>;
}
