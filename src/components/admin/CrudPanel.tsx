// components/admin/CrudPanel.tsx
'use client';
import { useState } from 'react';

type ActionBtn = {
  label: string;
  onClick: () => Promise<void> | void;
  disabled?: boolean;
};

export default function CrudPanel({
  title,
  actions = [], // 기본값 빈 배열
  children,
}: {
  title: string;
  actions?: ActionBtn[];
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void> | void) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-3 border rounded p-4">
      <header className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => run(a.onClick)}
                disabled={busy || a.disabled}
                className="px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </header>
      {children}
    </section>
  );
}