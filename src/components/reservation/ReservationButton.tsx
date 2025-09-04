'use client';

import React from 'react';
import { cn } from '@/utills/cn';

type ReservationButtonProps = {
  variant?: 'default' | 'primary';
  onClick?: () => void;
  children?: React.ReactNode;
};

export default function ReservationButton({
  variant = 'default',
  onClick,
  children = '상담 예약하기',
}: ReservationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-42 h-16 relative rounded-lg overflow-hidden',
        'flex items-center justify-center text-base font-medium',
        variant === 'default' &&
          'outline-1 outline-offset-[-1px] outline-box-line font-normal',
        variant === 'primary' &&
          'outline-2 outline-offset-[-2px] outline-primary-500 font-medium',
      )}
    >
      {children}
    </button>
  );
}
