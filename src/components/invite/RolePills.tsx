'use client';

import type { InviteForm } from '@/types/invite';
import clsx from 'clsx';

type Role = InviteForm['bride']['roleLabel']; // '아들' | '딸'

export function RolePills({
  value,
  onChange,
  className,
}: {
  value: Role;
  onChange: (v: Role) => void;
  className?: string;
}) {
  const roles: Role[] = ['아들', '딸'];

  return (
    <div className={clsx('inline-flex h-9 items-center gap-2 shrink-0', className)}>
      {roles.map((r) => {
        const active = value === r;
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={clsx(
              'px-3 rounded-xl text-sm leading-none border transition-colors',
              active
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200',
            )}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}

export default RolePills;