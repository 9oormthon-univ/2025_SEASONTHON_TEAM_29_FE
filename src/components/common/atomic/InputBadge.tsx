'use client';

import clsx from 'clsx';
import * as React from 'react';

export type InputBadgeVariant = 'primary' | 'secondary' | 'ghost';

export type InputBadgeProps = {
  children: React.ReactNode;
  variant?: InputBadgeVariant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export default function InputBadge({
  children,
  variant = 'primary',
  className,
  ...rest
}: InputBadgeProps) {
  const base =
    ' h-[24px] inline-flex items-center justify-center gap-2.5 px-2 py-0.5 rounded font-medium';
  const scheme =
    variant === 'primary'
      ? 'bg-primary-500 text-white'
      : variant === 'secondary'
        ? 'bg-primary-300 text-white'
        : 'bg-primary-200 text-primary-300';

  return (
    <button type="button" className={clsx(className, base, scheme)} {...rest}>
      <span className="text-[11px] leading-none">{children}</span>
    </button>
  );
}
