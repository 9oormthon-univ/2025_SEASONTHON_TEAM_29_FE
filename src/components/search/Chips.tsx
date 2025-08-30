'use client';

export function Chip({
  children, active, onClick,
}: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm border-gray-300 border
        ${active ? 'bg-primary-100' : 'bg-white'}`}
    >
      {children}
    </button>
  );
}

export function ChipGroup({
  values, selected, onToggle,
}: { values: readonly string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {values.map((v) => (
        <Chip key={v} active={selected.includes(v)} onClick={()=>onToggle(v)}>
          {v}
        </Chip>
      ))}
    </div>
  );
}

export function ChipSingle({
  values, value, onChange,
}: { values: readonly string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <Chip key={v} active={value === v} onClick={()=>onChange(value === v ? null : v)}>
          {v}
        </Chip>
      ))}
    </div>
  );
}