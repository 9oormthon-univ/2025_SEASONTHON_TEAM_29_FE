// src/components/reviews/ReviewSortTabs.tsx
'use client';

type Key = 'high' | 'low';
const TABS: { key: Key; label: string }[] = [
  { key: 'high', label: '링 높은순' },
  { key: 'low', label: '링 낮은순' },
];

export const toSortParam = (k: Key) => (k === 'high' ? 'rating,desc' : 'rating,asc');

export default function ReviewSortTabs({
  value,
  onChange,
}: { value: Key; onChange: (v: Key) => void }) {
  return (
    <div className="mt-3 flex gap-2">
      {TABS.map(t => {
        const active = value === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={[
              'py-[7px] rounded-full px-[16px] !text-[14px] border transition',
              active
                ? 'border-primary-300 bg-primary-50 text-primary-600'
                : 'border-gray-200 text-text-default',
            ].join(' ')}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}