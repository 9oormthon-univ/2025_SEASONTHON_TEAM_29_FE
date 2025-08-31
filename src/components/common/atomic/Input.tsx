'use client';

import clsx from 'clsx';
import * as React from 'react';

export type InputType =
  | 'default'
  | 'hover'
  | 'variant4'
  | 'variant5'
  | 'incorrect';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  type?: InputType;
  inputType?: React.HTMLInputTypeAttribute;
  fullWidth?: boolean;
  className?: string;
};

export default function Input({
  type: uiType = 'default',
  inputType = 'text',
  placeholder = '내용을 입력해 주세요.',
  fullWidth = true,
  className,
  disabled,
  ...rest
}: InputProps) {
  const base =
    'w-80 relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg px-4 py-2.5 h-10 outline outline-[1.2px] outline-offset-[-1.2px] bg-transparent';
  const frame =
    uiType === 'incorrect'
      ? 'outline-red-500'
      : uiType === 'hover'
        ? 'outline-box-line'
        : uiType === 'variant4' || uiType === 'variant5'
          ? 'outline-inputbox-active'
          : 'outline-gray-100';

  const text =
    uiType === 'incorrect'
      ? 'text-red-500'
      : uiType === 'variant4' || uiType === 'variant5'
        ? 'text-default'
        : 'text-tertiary';

  const ph =
    uiType === 'incorrect'
      ? 'placeholder:text-red-500'
      : uiType === 'variant4' || uiType === 'variant5'
        ? 'placeholder:text-foreground/80'
        : 'placeholder:text-gray-400';

  const width = fullWidth ? 'w-full' : 'w-80';

  return (
    <label
      className={clsx(base, frame, width, disabled && 'opacity-60', className)}
    >
      <input
        {...rest}
        type={inputType}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          'w-full bg-transparent outline-none text-sm leading-7',
          text,
          ph,
          uiType === 'variant5' && 'caret-primary-500',
        )}
      />
    </label>
  );
}
