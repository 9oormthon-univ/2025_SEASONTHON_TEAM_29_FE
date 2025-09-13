// src/components/common/RegionSearchField.tsx
'use client';

import { searchRegions } from '@/lib/region';
import { useState } from 'react';

export default function RegionSearchField({
  onSelect,
  placeholder = '지역 검색 (예: 역삼동)',
}: {
  onSelect: (code: number, name: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ name: string; code: number }[]>([]);
  const [open, setOpen] = useState(false);

  const handleChange = (q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      setResults(searchRegions(q));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  };

  const handleSelect = (code: number, name: string) => {
    onSelect(code, name);
    setQuery(name); // 선택된 이름을 input에 표시
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        className="border px-2 py-1 w-full rounded"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query.length >= 2 && setOpen(true)}
      />
      {open && results.length > 0 && (
        <ul className="absolute z-10 border rounded bg-white max-h-48 overflow-y-auto w-full shadow">
          {results.map((r) => (
            <li
              key={r.code}
              className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-sm"
              onClick={() => handleSelect(r.code, r.name)}
            >
              {r.name} <span className="text-gray-400">({r.code})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}