'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';
type FontFamily = '나눔명조' | 'Pretendard' | 'SUIT' | 'Inter';
type FontWeight = '얇게' | '보통' | '두껍게';
type TemplateType = 'Film' | 'Letter' | 'Album';

export type ThemaSectionValue = {
  fontFamily: FontFamily;
  fontWeight: FontWeight;
  accent: string;
  template: TemplateType;
  preventZoom: boolean;
  revealOnScroll: boolean;
};

type Props = {
  className?: string;
  title?: string;
  defaultOpen?: boolean;
  value: ThemaSectionValue;
  onChange: (next: ThemaSectionValue) => void;
  accents?: string[];
};

const DEFAULT_ACCENTS = ['#F7C7C7', '#C8B7F0', '#FBEFCF'];

const FONT_FAMILIES: FontFamily[] = ['나눔명조', 'Pretendard', 'SUIT', 'Inter'];
const FONT_WEIGHTS: FontWeight[] = ['얇게', '보통', '두껍게'];
const TEMPLATES: TemplateType[] = ['Film', 'Letter', 'Album'];

export default function ThemaSection({
  className,
  title = '테마',
  defaultOpen = false,
  value,
  onChange,
  accents = DEFAULT_ACCENTS,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;

  const handle = {
    fontFamily(ff: FontFamily) {
      onChange({ ...value, fontFamily: ff });
    },
    fontWeight(fw: FontWeight) {
      onChange({ ...value, fontWeight: fw });
    },
    accent(color: string) {
      onChange({ ...value, accent: color });
    },
    template(t: TemplateType) {
      onChange({ ...value, template: t });
    },
    toggle(name: 'preventZoom' | 'revealOnScroll') {
      onChange({ ...value, [name]: !value[name] });
    },
  };

  return (
    <section
      className={clsx('w-80', className)}
      aria-labelledby={headerId}
      data-open={open}
    >
      <button
        id={headerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'w-80 h-12 px-4 py-2.5 rounded-lg',
          'outline-[1.2px] outline-offset-[-1.2px] outline-box-line',
          'inline-flex items-center justify-between gap-2',
        )}
      >
        <span className="text-text--default text-sm font-semibold leading-normal">
          {title}
        </span>
        <SvgObject
          src="/icons/down.svg"
          alt=""
          width={12}
          height={6}
          className={clsx(
            'shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className={clsx(
            'mt-3 rounded-lg',
            'outline-[1.2px] outline-offset-[-1.2px] outline-box-line',
            'relative overflow-hidden',
          )}
        >
          <div className="px-4 pt-3 pb-6">
            <FieldRow label="글꼴">
              <div className="flex gap-2">
                <SelectLike
                  value={value.fontFamily}
                  onChange={(v) => handle.fontFamily(v as FontFamily)}
                  options={FONT_FAMILIES}
                  className="w-28"
                />
                <SelectLike
                  value={value.fontWeight}
                  onChange={(v) => handle.fontWeight(v as FontWeight)}
                  options={FONT_WEIGHTS}
                  className="w-20"
                />
              </div>
            </FieldRow>
            <FieldRow label="강조 색상" className="mt-3">
              <div className="flex items-center gap-2.5">
                {accents.map((c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    selected={value.accent === c}
                    onClick={() => handle.accent(c)}
                  />
                ))}
              </div>
            </FieldRow>
            <FieldRow label="템플릿" className="mt-3">
              <div className="flex items-center gap-1.5">
                {TEMPLATES.map((t) => (
                  <Pill
                    key={t}
                    selected={value.template === t}
                    onClick={() => handle.template(t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
            </FieldRow>

            <div className="my-4 w-full h-px outline-[0.5px] outline-offset-[-0.25px] outline-box-line" />
            <div className="flex flex-col gap-3">
              <CheckRow
                label="청첩장 확대 방지"
                checked={value.preventZoom}
                onChange={() => handle.toggle('preventZoom')}
              />
              <CheckRow
                label="스크롤 시, 자연스럽게 등장"
                checked={value.revealOnScroll}
                onChange={() => handle.toggle('revealOnScroll')}
              />
            </div>
          </div>
          <div className="w-full h-0 outline-[0.5px] outline-offset-[-0.25px] outline-box-line" />
          <div className="w-full h-0 outline-[0.5px] outline-offset-[-0.25px] outline-box-line" />
        </div>
      )}
    </section>
  );
}
function FieldRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mt-4', className)}>
      <div className="text-text--default text-xs font-medium leading-normal mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function SelectLike<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[] | T[];
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const idx = options.findIndex((o) => o === value);
        const next = options[(idx + 1) % options.length];
        onChange(next);
      }}
      className={clsx(
        'h-8 px-3 rounded',
        'bg-option-box-',
        'inline-flex items-center justify-between gap-2',
        'w-24 text-left',
        className,
      )}
      aria-label={`${value} 선택됨 (클릭해서 변경)`}
    >
      <span className="text-text--default text-xs leading-9">{value}</span>
      <SvgObject
        src="/icons/down.svg"
        alt=""
        width={12}
        height={6}
        className="shrink-0"
      />
    </button>
  );
}

function ColorSwatch({
  color,
  selected,
  onClick,
}: {
  color: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  const size = selected ? 'w-8 h-8' : 'w-7 h-7';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`강조 색상 ${color}${selected ? ' (선택됨)' : ''}`}
      className={clsx(
        'rounded-full border-[0.5px]',
        selected ? 'border-text--default' : 'border-box-line',
        size,
      )}
      style={{ background: color }}
    />
  );
}

function Pill({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-3 h-8 rounded-full',
        'outline-1 outline-offset-[-1px]',
        selected ? 'bg-primary-200 outline-primary-300' : 'outline-box-line',
        'flex items-center justify-center',
      )}
    >
      <span className="text-xs leading-9 text-text--default">{children}</span>
    </button>
  );
}
function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange();
          }
        }}
        onClick={onChange}
        className={clsx(
          'w-4 h-4 inline-flex items-center justify-center',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60 rounded-[4px]',
          checked
            ? 'outline-none bg-transparent'
            : 'bg-transparent outline-1 outline-box-line',
        )}
      >
        {/* 체크 시엔 아이콘만 노출 */}
        {checked && (
          <SvgObject
            src="/icons/check.svg"
            alt=""
            width={16}
            height={16}
            className="pointer-events-none"
          />
        )}
      </span>
      <span className="text-xs font-medium leading-normal text-text--secondary">
        {label}
      </span>
    </label>
  );
}
