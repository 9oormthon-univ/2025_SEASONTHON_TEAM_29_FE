'use client';
export function SelectField({ label, value, onChange, options }:{
  label: string; value: string; onChange: (v: string)=>void; options: readonly string[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-40 text-sm">{label}</span>
      <select className="border px-2 py-1 w-full" value={value} onChange={e=>onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}