'use client';

import { useEffect, useRef } from 'react';

export function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'; // 리셋
      ref.current.style.height = ref.current.scrollHeight + 'px'; // 내용에 맞게
    }
  }, [value]);

  return (
    <label className="flex items-start gap-2">
      <span className="w-40 text-sm mt-1">{label}</span>
      <textarea
        ref={ref}
        className="border px-2 py-1 w-[800px] rounded resize-none overflow-hidden whitespace-pre-wrap break-words"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}