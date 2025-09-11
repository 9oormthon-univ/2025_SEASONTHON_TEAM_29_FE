'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';
import CheckComponent from '@/components/invitation/CheckComponent';

export type PlaceSectionValue = {
  venueName: string;
  hallInfo: string;
  showMap: boolean;
};

type Props = {
  className?: string;
  title?: string;
  defaultOpen?: boolean;
  value: PlaceSectionValue;
  onChange: (next: PlaceSectionValue) => void;
  onSearch?: (keyword: string) => void;
};

export default function PlaceSection({
  className,
  title = '예약 장소',
  defaultOpen = true,
  value,
  onChange,
  onSearch,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;

  const patch = <K extends keyof PlaceSectionValue>(
    key: K,
    v: PlaceSectionValue[K],
  ) => onChange({ ...value, [key]: v });

  return (
    <section
      className={clsx(
        'w-80 rounded-lg outline-[1.2px] outline-offset-[-1.2px] outline-box-line overflow-hidden',
        className,
      )}
      aria-labelledby={headerId}
      data-open={open}
    >
      <button
        id={headerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full h-[52px] px-4 py-0 inline-flex items-center justify-between"
      >
        <span className="text-text--default text-sm font-semibold leading-normal">
          {title}
        </span>
        <SvgObject
          src="/icons/down.svg"
          alt=""
          width={20}
          height={20}
          className={clsx(
            'transition-transform opacity-60',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headerId}>
          <Hr className="-mt-8" />

          <div className="px-4 pt-3 pb-4">
            <FieldRow label="예식장명" className="mt-1">
              <div className="flex items-center gap-2">
                <BoxInput
                  placeholder=""
                  value={value.venueName}
                  onChange={(v) => patch('venueName', v)}
                  className="w-37"
                />
                <button
                  type="button"
                  onClick={() => onSearch?.(value.venueName)}
                  className={clsx(
                    'w-13 h-8 px-3 rounded !text-xs',
                    'bg-white outline-[0.5px] outline-offset-[-0.5px] outline-text-secondary',
                  )}
                >
                  검색
                </button>
              </div>
            </FieldRow>

            <FieldRow label="층과 홀" className="mt-4">
              <BoxInput
                placeholder="홀 이름과 층을 알려주세요."
                value={value.hallInfo}
                onChange={(v) => patch('hallInfo', v)}
                className="w-52"
              />
            </FieldRow>

            <Hr className="my-4" />

            <FieldRow label="약도">
              <button
                type="button"
                onClick={() => patch('showMap', !value.showMap)}
                className="inline-flex items-center gap-1 px-1"
              >
                <CheckComponent selected={value.showMap} />
                <span className="text-xs font-medium text-text--default">
                  약도 그림 표시
                </span>
              </button>
            </FieldRow>
          </div>
        </div>
      )}
    </section>
  );
}

function Hr({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'w-full h-0 outline-[0.5px] outline-offset-[-0.25px] outline-box-line mb-8',
        className,
      )}
    />
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
    <div className={clsx('mt-3 flex items-center gap-4', className)}>
      <div className="w-16 shrink-0 text-text--default text-xs font-medium leading-normal">
        {label}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function BoxInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'relative h-8 rounded bg-option-box overflow-hidden',
        'min-w-[2rem]',
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'absolute inset-0 w-full h-full px-2.5',
          '!text-xs text-text--default placeholder:text-text-secondary',
          'leading-8',
          'bg-transparent outline-none ring-0',
        )}
      />
    </div>
  );
}
