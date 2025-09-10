// src/components/invite/FormRow.tsx
'use client';

import clsx from 'clsx';

type Props = {
  label: string;
  children: React.ReactNode;
  /** 마지막 행이면 구분선 제거 */
  noDivider?: boolean;
  /** 라벨 아래 설명(선택) */
  subLabel?: string;
  className?: string;
};

export default function FormRow({
  label,
  children,
  noDivider = false,
  subLabel,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'grid grid-cols-[86px_1fr] items-center gap-3 py-3',
        !noDivider && 'border-b border-gray-200',
        className,
      )}
    >
      <div className="leading-tight">
        <div className="text-[13px] font-medium text-gray-700">{label}</div>
        {subLabel && (
          <div className="mt-0.5 text-[12px] text-gray-400">{subLabel}</div>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}