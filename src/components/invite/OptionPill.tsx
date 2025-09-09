// src/components/invite/OptionPill.tsx
'use client';

import clsx from 'clsx';

export function OptionPill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full px-3 py-1 text-sm',
        active
          ? 'border border-rose-300 text-rose-600 bg-white'
          : 'border border-gray-200 text-gray-600 bg-white',
      )}
    >
      {children}
    </button>
  );
}

export function ColorDot({
  color,
  active,
  onClick,
}: {
  color: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`accent ${color}`}
      className={clsx(
        'h-7 w-7 rounded-full ring-2',
        active ? 'ring-gray-800' : 'ring-transparent',
      )}
      style={{ backgroundColor: color }}
    />
  );
}