// src/components/forms/InputWithButton.tsx
'use client';

import Input from '@/components/common/atomic/Input';
import InputBadge from '@/components/common/atomic/InputBadge';
import { cn } from '@/utills/cn'; // ← utills 오타 주의!
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
  const { type: htmlType, className: inputClassName, ...restInput } = inputProps;

  return (
    <div className={cn('relative mt-2 w-full', className)}>
      {/* 인풋: atomic 스타일 그대로, 오른쪽 패딩만 확보 */}
      <Input
        {...restInput}
        inputType={htmlType}
        fullWidth
        aria-invalid={invalid || undefined}
        className={cn(
          'pr-[112px]', // 배지 자리 확보 (배지 가로 폭에 맞춰 조정)
          inputClassName
        )}
      />

      {/* 배지 버튼: 스타일(색/패딩/라운드) 변경 X, 위치만 지정 */}
      <InputBadge
        type="button"
        onClick={disabled ? undefined : onButtonClick}
        disabled={disabled}
        variant={disabled ? 'ghost' : 'primary'} // 디자인 제공된 variant만 사용
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {buttonText}
      </InputBadge>
    </div>
  );
}