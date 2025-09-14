// src/components/search/QueryInput.tsx
'use client';

import { searchRegions } from '@/lib/region';
import { Search, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

type Props = {
  query: string;
  onQueryChange: (v: string) => void;
  selected: string[];
  onSelectedChange: (list: string[]) => void;
};

export default function QueryInput({
  query,
  onQueryChange,
  selected,
  onSelectedChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ 전국 행정구역 검색 (3단계: 시/도 + 시군구 + 읍면동)
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchRegions(query.trim(), 20) // 최대 20개까지 추천
      .filter((s) => !selected.includes(s.name));
  }, [query, selected]);

  const addChip = (name: string) => {
    if (selected.includes(name)) return;
    onSelectedChange([...selected, name]);
    onQueryChange('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const removeChip = (name: string) => {
    onSelectedChange(selected.filter((x) => x !== name));
    inputRef.current?.focus();
  };

  return (
    <div className="px-1">
  <div
    className="relative rounded-full bg-gray-100 pl-4 pr-10 py-1"
    onClick={() => inputRef.current?.focus()}
  >
    {/* 칩 + 인풋 스크롤 영역 */}
    <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide">
      {selected.map((tag) => {
        const shortName = tag.split(' ').slice(-1)[0];
        return (
          <span
            key={tag}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-500/10 px-3 py-1 text-sm font-semibold text-primary-500"
          >
            {shortName}
            <button
              type="button"
              aria-label={`${shortName} 제거`}
              onClick={(e) => {
                e.stopPropagation();
                removeChip(tag);
              }}
              className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary-500/15"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}

      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={selected.length ? '' : '지역명을 입력해 주세요'}
        className="min-w-[120px] flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-500"
      />
    </div>

    {/* ✅ 검색 버튼 */}
    <button
      aria-label="search"
      className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-gray-200"
      onClick={() => setOpen(false)}
    >
      <Search className="h-5 w-5" />
    </button>

    {/* ✅ 드롭다운: relative 안에 넣어서 input 바로 아래 뜨도록 */}
    {open && suggestions.length > 0 && (
      <ul
        className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-auto rounded-2xl border border-gray-300 bg-white p-2 shadow-lg"
        onMouseDown={(e) => e.preventDefault()}
      >
        {suggestions.map((s) => (
          <li key={s.code}>
            <button
              type="button"
              onClick={() => addChip(s.name)}
              className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
              {highlight(s.name, query)}
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* 백드롭 */}
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