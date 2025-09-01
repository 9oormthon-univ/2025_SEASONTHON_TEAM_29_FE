'use client';

import type { TourTab } from '@/types/tour';

type Props = { value: TourTab; onChange: (t: TourTab) => void };

export default function TourTabs({ value, onChange }: Props) {
  const base = 'flex-1 py-3 text-sm font-medium';
  const active = 'text-pink-500 border-b-2 border-pink-500';
  const inactive = 'text-gray-400';

  return (
    <div className="flex border-b">
      <button
        type="button"
        onClick={() => onChange('dressTour')}
        className={`${base} ${value === 'dressTour' ? active : inactive}`}
        aria-selected={value === 'dressTour'}
      >
        드레스 투어
      </button>
      <button
        type="button"
        onClick={() => onChange('dressRomance')}
        className={`${base} ${value === 'dressRomance' ? active : inactive}`}
        aria-selected={value === 'dressRomance'}
      >
        드레스 로망
      </button>
    </div>
  );
}