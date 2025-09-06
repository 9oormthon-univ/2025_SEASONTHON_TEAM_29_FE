'use client';

import Input from '@/components/common/atomic/Input';
import InputBadge from '@/components/common/atomic/InputBadge';
import { cn } from '@/utills/cn';
import * as React from 'react';

type Props = {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  buttonText: string;
  onButtonClick?: () => void;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
};

export function InputWithButton({
  inputProps,
  buttonText,
  onButtonClick,
  className,
  disabled,
  invalid,
}: Props) {
  const {
    type: htmlType,
    className: inputClassName,
    value,
    ...restInput
  } = inputProps;
  const [focused, setFocused] = React.useState(false);

  const hasValue = value !== '' && value !== undefined;
  const uiType = focused || hasValue ? 'variant4' : 'default';

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        {...restInput}
        inputType={htmlType}
        value={value}
        type={uiType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        fullWidth
        aria-invalid={invalid || undefined}
        className={cn('pr-[112px]', inputClassName)}
      />

      <InputBadge
        type="button"
        onClick={disabled ? undefined : onButtonClick}
        disabled={disabled}
        variant={disabled ? 'ghost' : 'primary'}
        className="absolute right-4 top-1/2 -translate-y-1/2"
      >
        {buttonText}
      </InputBadge>
    </div>
  );
}
