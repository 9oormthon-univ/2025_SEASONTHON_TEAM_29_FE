'use client';
export function TextField({ label, value, onChange }:{
  label: string; value: string; onChange: (v: string)=>void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-40 text-sm">{label}</span>
      <input className="border px-2 py-1 w-full" value={value} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}