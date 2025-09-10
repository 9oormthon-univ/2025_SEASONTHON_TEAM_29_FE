// src/components/invite/ThemeSection.tsx
'use client';
import { ACCENTS, FONT_FAMILIES, FONT_WEIGHTS, TEMPLATES, isOneOf, type InviteForm } from '@/types/invite';
import FormRow from './FormRow';
import FormSection from './FormSection';
import { ColorDot, OptionPill } from './OptionPill';

export default function ThemeSection({
  value,
  onChange,
}: {
  value: InviteForm['theme'];
  onChange: (v: InviteForm['theme']) => void;
}) {
  return (
    <FormSection title="테마" openByDefault>
      <FormRow label="글꼴" noDivider>
        <div className="flex gap-3">
          <select
            className="rounded-md border p-2"
            value={value.fontFamily}
            onChange={(e) => {
              const v = e.target.value;
              if (isOneOf(FONT_FAMILIES, v)) onChange({ ...value, fontFamily: v });
            }}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <select
            className="rounded-md border p-2"
            value={value.fontWeight}
            onChange={(e) => {
              const v = e.target.value;
              if (isOneOf(FONT_WEIGHTS, v)) onChange({ ...value, fontWeight: v });
            }}
          >
            {FONT_WEIGHTS.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </div>
      </FormRow>

      <FormRow label="강조 색상" noDivider>
        <div className="flex gap-3">
          {ACCENTS.map((c) => (
            <ColorDot
              key={c}
              color={c}
              active={value.accent === c}
              onClick={() => onChange({ ...value, accent: c })}
            />
          ))}
        </div>
      </FormRow>

      <FormRow label="템플릿">
        <div className="flex gap-2">
          {TEMPLATES.map((t) => (
            <OptionPill
              key={t}
              active={value.template === t}
              onClick={() => onChange({ ...value, template: t })}
            >
              {t}
            </OptionPill>
          ))}
        </div>
      </FormRow>

      <FormRow label="확대 방지" noDivider>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.preventZoom}
            onChange={(e) =>
              onChange({ ...value, preventZoom: e.target.checked })
            }
          />
          <span className="text-gray-800">청첩장 확대 방지</span>
        </label>
      </FormRow>

      <FormRow label="등장 효과" noDivider>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.entryEffect === 'scroll-fade'}
            onChange={(e) =>
              onChange({
                ...value,
                entryEffect: e.target.checked ? 'scroll-fade' : 'none',
              })
            }
          />
          <span className="text-gray-800">스크롤 시, 자연스럽게 등장</span>
        </label>
      </FormRow>
    </FormSection>
  );
}