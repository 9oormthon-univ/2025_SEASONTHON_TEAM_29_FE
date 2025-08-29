'use client';

import { cn } from '@/utills/cn';
import * as React from 'react';

type Props = {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
};

export function Field({ label, htmlFor, className, children, required }: Props) {
  return (
    <div className={cn('mt-5', className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}