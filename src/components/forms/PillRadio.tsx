'use client';

import clsx from 'clsx';

type Option = { value: string; label: string };

export function PillRadio({
  options,
  value,
  onChange,
  className,
}: {
  options: Option[];
  value: string | null;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={clsx('mt-2 flex gap-3', className)} role="radiogroup">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={clsx(
              '!text-[14px] rounded-full px-4 py-2 text-sm transition-colors border focus:outline-none',
              selected
                ? 'bg-primary-200 text-black border-primary-300'
                : 'bg-white text-black border-box-line',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
