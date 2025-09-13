'use client';
export function NumberField({ label, value, onChange }:{
  label: string; value: number; onChange: (v: number)=>void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-40 text-sm">{label}</span>
      <input type="number" className="border px-2 py-1 w-full"
        value={Number.isFinite(value) ? value : ''} onChange={e=>onChange(Number(e.target.value))}/>
    </label>
  );
}