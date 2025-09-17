'use client';

import type { TourTab } from '@/types/tour';

export default function TourTabs({
  value,
  onChange,
}: {
  value: TourTab;
  onChange: (tab: TourTab) => void;
}) {
  const base = 'flex-1 py-3 text-sm font-medium';
  const active = 'text-black border-b-3 border-primary-500';
  const inactive = 'text-gray-400';

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => onChange('dressTour')}
        className={`${base} ${value === 'dressTour' ? active : inactive}`}
        aria-current={value === 'dressTour' ? 'page' : undefined}
      >
        드레스 투어
      </button>
      <button
        type="button"
        onClick={() => onChange('dressRomance')}
        className={`${base} ${value === 'dressRomance' ? active : inactive}`}
        aria-current={value === 'dressRomance' ? 'page' : undefined}
      >
        드레스 로망
      </button>
    </div>
  );
}