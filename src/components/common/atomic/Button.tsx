'use client';

import clsx from 'clsx';
import * as React from 'react';

type ButtonSize = 'lg' | 'md';
type ButtonState = 'default' | 'hover' | 'inactive';

export type ButtonProps = {
  children: React.ReactNode;
  size?: ButtonSize;
  state?: ButtonState;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
};

export default function Button({
  children,
  size = 'lg',
  state,
  disabled,
  fullWidth,
  className,
  type = 'button',
  onClick,
  ariaLabel,
}: ButtonProps) {
  const isInactive = disabled || state === 'inactive';

  const sizeClass =
    size === 'lg' ? 'w-80 py-3 rounded-xl' : 'px-14 py-2.5 rounded-xl';

  const colorClass = isInactive
    ? 'bg-primary-200 text-primary-300 cursor-not-allowed'
    : state === 'hover'
      ? 'bg-primary-300 text-white/80'
      : 'bg-primary-500 text-white hover:bg-primary-300 hover:text-white/80';

  const baseClass =
    'inline-flex items-center justify-center gap-2.5 overflow-hidden text-size-16px font-semibold leading-7';

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-disabled={isInactive}
      disabled={isInactive}
      onClick={onClick}
      className={clsx(
        baseClass,
        sizeClass,
        colorClass,
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  );
}
