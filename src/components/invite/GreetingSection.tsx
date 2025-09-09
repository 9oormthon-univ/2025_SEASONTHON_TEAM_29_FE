// src/components/invite/GreetingSection.tsx
'use client';
import { GREET_SORTS, isOneOf, type InviteForm } from '@/types/invite';
import FormSection from './FormSection';

export default function GreetingSection({
  value, onChange,
}: {
  value: InviteForm['greeting'];
  onChange: (v: InviteForm['greeting']) => void;
}) {
  return (
    <FormSection title="인사말">
      <div className="mt-3 space-y-2 text-sm">
        <input className="w-full rounded-md border p-2" placeholder="제목"
          value={value.title} onChange={(e)=> onChange({ ...value, title: e.target.value })}/>
        <textarea className="min-h-28 w-full rounded-md border p-2" placeholder="내용"
          value={value.body} onChange={(e)=> onChange({ ...value, body: e.target.value })}/>
        <label className="flex items-center gap-2">
          <span className="text-gray-600">정렬</span>
          <select className="rounded-md border p-2" value={value.sort}
            onChange={(e)=> { const v = e.target.value; if (isOneOf(GREET_SORTS, v)) onChange({ ...value, sort: v }); }}>
            {GREET_SORTS.map((s)=><option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
    </FormSection>
  );
}