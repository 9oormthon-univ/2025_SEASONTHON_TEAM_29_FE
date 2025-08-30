// src/components/search/FiltersSummary.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function FiltersSummary({
  count,
}: { count: number }) {
  const router = useRouter();
  const sp = useSearchParams();

  // 칩 제거: 해당 키를 URL에서 지우고 replace
  const remove = (key: string, val?: string) => {
    const p = new URLSearchParams(sp.toString());
    if (!val) {
      p.delete(key);
    } else {
      const all = p.getAll(key).filter(v => v !== val);
      p.delete(key);
      all.forEach(v => p.append(key, v));
    }
    router.replace(`/search/results?${p.toString()}`);
  };

  const areas = sp.getAll('area');
  const styles = sp.getAll('style');
  const meals  = sp.getAll('meal');
  const trans  = sp.getAll('trans');
  const cat    = sp.get('cat');
  const guest  = sp.get('guest');

  return (
    <section className="sticky top-0 z-10 bg-white/90 backdrop-blur">
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {areas.map(a => (
          <Chip key={`area:${a}`} tone="main" onRemove={() => remove('area', a)}>{a}</Chip>
        ))}
        {cat && <Chip onRemove={() => remove('cat')}>{cat}</Chip>}
        {styles.map(s => <Chip key={`style:${s}`} onRemove={() => remove('style', s)}>{s}</Chip>)}
        {meals.map(m  => <Chip key={`meal:${m}`}  onRemove={() => remove('meal', m)}>{m}</Chip>)}
        {guest && <Chip onRemove={() => remove('guest')}>{guest}</Chip>}
        {trans.map(t => <Chip key={`trans:${t}`} onRemove={() => remove('trans', t)}>{t}</Chip>)}
        <span className="ml-auto text-sm text-gray-500">{count}개 결과</span>
      </div>
    </section>
  );
}

function Chip({
  children, onRemove, tone='gray',
}: { children: React.ReactNode; onRemove: () => void; tone?: 'gray'|'main' }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm
      ${tone==='main' ? 'bg-primary-500/10 text-primary-500' : 'bg-gray-100 text-gray-700'}`}>
      {children}
      <button aria-label="삭제" className="ml-0.5 text-gray-400 hover:text-gray-600" onClick={onRemove}>×</button>
    </span>
  );
}