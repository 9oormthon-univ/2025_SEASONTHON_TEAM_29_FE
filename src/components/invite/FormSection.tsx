// src/components/invite/FormSection.tsx
'use client';

import clsx from 'clsx';
import { useId } from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  /** 최초 렌더에만 열림 상태로 표시 (uncontrolled) */
  openByDefault?: boolean;
  endAdornment?: React.ReactNode;
  className?: string;
};

export default function FormSection({
  title,
  children,
  openByDefault = false,
  endAdornment,
  className,
}: Props) {
  const id = useId();

  return (
    <details
      // ✅ defaultOpen 대신 조건부로 open 속성만 주입
      {...(openByDefault ? { open: true } : {})}
      className={clsx('mb-3 rounded-2xl bg-white p-0 shadow-sm', className)}
    >
      <summary
        aria-controls={id}
        className={clsx(
          'list-none cursor-pointer select-none',
          'flex items-center justify-between gap-3',
          'px-4 py-3'
        )}
      >
        <span className="text-base font-semibold">{title}</span>
        <span className="ml-auto flex items-center gap-2 text-sm text-gray-500">
          {endAdornment}
          <svg
            className="h-4 w-4 transition-transform duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>

      <div id={id} className="px-4 pb-4 pt-1 text-sm">
        {children}
      </div>

      <style jsx>{`
        details[open] summary svg {
          transform: rotate(180deg);
        }
      `}</style>
    </details>
  );
}