// src/components/my/MyTabs.tsx
'use client';

export type MyTabKey = 'reserve' | 'review' | 'invite';

export default function MyTabs({
  value,
  onChange,
}: {
  value: MyTabKey;
  onChange: (key: MyTabKey) => void;
}) {
  const base = 'px-1 pb-1';
  const active = 'border-b-2 border-primary-400';
  return (
    <div className="mt-6 flex gap-6">
      <button onClick={() => onChange('reserve')} className={`${base} ${value === 'reserve' ? active : ''}`}>계약건</button>
      <button onClick={() => onChange('review')}  className={`${base} ${value === 'review'  ? active : ''}`}>후기</button>
      <button onClick={() => onChange('invite')}  className={`${base} ${value === 'invite'  ? active : ''}`}>청첩장</button>
    </div>
  );
}