'use client';

import { cn } from '@/utills/cn';

export default function FieldHint({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode;
  tone?: 'default' | 'error' | 'success';
  className?: string;
}) {
  const toneClass =
    tone === 'error'
      ? 'text-red-500'
      : tone === 'success'
      ? 'text-emerald-600'
      : 'text-gray-500';
  return <p className={cn('mt-1 text-xs', toneClass, className)}>{children}</p>;
}