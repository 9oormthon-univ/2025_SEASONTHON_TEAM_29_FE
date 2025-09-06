import clsx from 'clsx';
import InputBadge, {
  type InputBadgeProps,
  type InputBadgeVariant,
} from './InputBadge';
import React from 'react';

export type InputVisualType =
  | 'default'
  | 'hover'
  | 'variant4'
  | 'variant5'
  | 'incorrect';
export type InputVariant = 'plain' | 'with-badge';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  type?: InputVisualType;
  variant?: InputVariant;
  inputType?: React.HTMLInputTypeAttribute;
  fullWidth?: boolean;
  className?: string;
  badge?: React.ReactNode | InputBadgeProps;
  badgeText?: string;
  badgeVariant?: InputBadgeVariant;
  onBadgeClick?: () => void;
  badgeDisabled?: boolean;
};

export default function Input({
  type: uiType = 'default',
  variant = 'plain',
  inputType = 'text',
  placeholder = '내용을 입력해 주세요.',
  fullWidth = true,
  className,
  disabled,
  badge,
  badgeText,
  badgeVariant = 'primary',
  onBadgeClick,
  badgeDisabled,
  ...rest
}: InputProps) {
  const base =
    'relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg px-4 py-2.5 h-12 outline outline-[1.2px] outline-offset-[-1.2px] bg-transparent';

  const frame =
    uiType === 'incorrect'
      ? 'outline-red-500'
      : uiType === 'hover'
        ? 'outline-box-line'
        : uiType === 'variant4' || uiType === 'variant5'
          ? 'outline-input-box--active'
          : 'outline-gray-100';

  const text =
    uiType === 'incorrect'
      ? 'text-red-500'
      : uiType === 'variant4' || uiType === 'variant5'
        ? 'text-text--default'
        : 'text-text--tertiary';

  const ph =
    uiType === 'incorrect'
      ? 'placeholder:text-red-500'
      : uiType === 'variant4' || uiType === 'variant5'
        ? 'placeholder:text-foreground/80'
        : 'placeholder:text-text--tertiary';

  const width = fullWidth ? 'w-full' : 'w-80';
  const inputClass = clsx(
    'flex-1 bg-transparent outline-none !text-[14px] leading-tight',
    text,
    ph,
    uiType === 'variant5' && 'caret-primary-500',
  );
  const badgeNode = badge ? (
    React.isValidElement(badge) ? (
      badge
    ) : (
      <InputBadge {...(badge as InputBadgeProps)} />
    )
  ) : variant === 'with-badge' && badgeText ? (
    <InputBadge
      variant={badgeVariant}
      onClick={onBadgeClick}
      disabled={badgeDisabled}
      className="h-8 px-2"
    >
      {badgeText}
    </InputBadge>
  ) : null;

  return (
    <label
      className={clsx(base, frame, width, disabled && 'opacity-60', className)}
    >
      <input
        {...rest}
        type={inputType}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass}
      />
      {badgeNode}
    </label>
  );
}
