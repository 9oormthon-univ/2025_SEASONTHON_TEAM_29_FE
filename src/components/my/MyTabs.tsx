'use client';

export type MyTabKey = 'reserve' | 'review' | 'invite';

export default function MyTabs({
  value,
  onChange,
}: {
  value: MyTabKey;
  onChange: (key: MyTabKey) => void;
}) {
  const base = 'px-1 pb-1 text-text-secondary';
  const active = 'border-b-2 border-primary-400 text-text-default';

  return (
    <div className="mt-6 flex gap-6 font-medium">
      <button
        type="button"
        aria-selected={value === 'reserve'}
        onClick={() => onChange('reserve')}
        className={`${base} ${value === 'reserve' ? active : ''}`}
      >
        계약건
      </button>
      <button
        type="button"
        aria-selected={value === 'review'}
        onClick={() => onChange('review')}
        className={`${base} ${value === 'review' ? active : ''}`}
      >
        후기
      </button>
      <button
        type="button"
        aria-selected={value === 'invite'}
        onClick={() => onChange('invite')}
        className={`${base} ${value === 'invite' ? active : ''}`}
      >
        청첩장
      </button>
    </div>
  );
}
