// src/components/invite/CeremonySection.tsx
'use client';
import type { InviteForm } from '@/types/invite';
import FormSection from './FormSection';

export default function CeremonySection({
  value, onChange,
}: {
  value: InviteForm['ceremony'];
  onChange: (v: InviteForm['ceremony']) => void;
}) {
  return (
    <FormSection title="예식 일시">
      <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
        <input type="date" className="col-span-3 rounded-md border p-2"
          value={value.date} onChange={(e)=> onChange({ ...value, date: e.target.value })}/>
        <select className="col-span-2 rounded-md border p-2"
          value={value.hour} onChange={(e)=> onChange({ ...value, hour: Number(e.target.value) })}>
          {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i}시</option>)}
        </select>
        <select className="rounded-md border p-2"
          value={value.minute} onChange={(e)=> onChange({ ...value, minute: Number(e.target.value) })}>
          <option value={0}>00분</option>
          <option value={30}>30분</option>
        </select>
        <label className="col-span-3 mt-1 flex items-center gap-2">
          <input type="checkbox" checked={value.showDday}
            onChange={(e)=> onChange({ ...value, showDday: e.target.checked })}/>
          <span>디데이 카운트다운 표시</span>
        </label>
      </div>
    </FormSection>
  );
}