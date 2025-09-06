'use client';

import { Search, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

const DISTRICTS = [
  '종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'
];

type Props = {
  query: string;                      
  onQueryChange: (v: string) => void;
  selected: string[];                 
  onSelectedChange: (list: string[]) => void;
};

export default function QueryInput({
  query, onQueryChange, selected, onSelectedChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 추천어 필터링 (이미 선택한 칩은 제외)
  const suggestions = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return DISTRICTS
      .filter((d) => d.includes(q))
      .filter((d) => !selected.includes(d))
      .slice(0, 8);
  }, [query, selected]);

  const addChip = (v: string) => {
    if (selected.includes(v)) return;
    onSelectedChange([...selected, v]);
    onQueryChange('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeChip = (v: string) => {
    onSelectedChange(selected.filter((x) => x !== v));
    inputRef.current?.focus();
  };

  const submit = () => {
    // 예시: /search/results?areas=강남,영등포&q=...
    const qs = new URLSearchParams();
    if (selected.length) qs.set('areas', selected.join(','));
    if (query.trim()) qs.set('q', query.trim());
  };

  return (
    <div className="px-1">
      <div
        className="relative rounded-full bg-gray-100 px-4 py-1"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selected.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1 text-sm font-semibold text-primary-500"
            >
              {tag}
              <button
                type="button"
                aria-label={`${tag} 제거`}
                onClick={(e) => { e.stopPropagation(); removeChip(tag); }}
                className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary-500/15"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { onQueryChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); submit(); }
              if (e.key === 'Backspace' && query.length === 0 && selected.length > 0) {
                removeChip(selected[selected.length - 1]);
              }
              if (e.nativeEvent instanceof TouchEvent) {
                (e.target as HTMLInputElement).closest('div')?.classList.add('touch-pan-y');
              }
            }}
            placeholder={selected.length ? '' : '지역명을 입력해 주세요'}
            className="min-w-[120px] flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-500"
          />

          <button
            aria-label="search"
            onClick={submit}
            className="ml-auto grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-gray-200"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* 추천어 드롭다운 */}
        {open && suggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-auto rounded-2xl border border-gray-300 bg-white p-2 shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => addChip(s)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  {highlight(s, query)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <button
          aria-label="close suggestions"
          className="fixed inset-0 z-10 cursor-default"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.indexOf(q);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <b className="text-primary-500">{text.slice(idx, idx + q.length)}</b>
      {text.slice(idx + q.length)}
    </>
  );
}