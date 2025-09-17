'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';
import CheckComponent from '@/components/invitation/CheckComponent';

export type MessageSectionValue = {
  title: string;
  body: string;
  ordered: boolean;
};

type Props = {
  className?: string;
  title?: string;
  defaultOpen?: boolean;
  value: MessageSectionValue;
  onChange: (next: MessageSectionValue) => void;
};

export default function MessageSection({
  className,
  title = '인사말',
  defaultOpen = true,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;

  const patch = <K extends keyof MessageSectionValue>(
    path: K,
    v: MessageSectionValue[K],
  ) => {
    const next = structuredClone(value);
    next[path] = v;
    onChange(next);
  };

  return (
    <section
      className={clsx(
        'w-90 rounded-lg outline-[1.2px] outline-offset-[-1.2px] outline-box-line overflow-hidden',
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
          width={12}
          height={6}
          className={clsx(
            'shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headerId}>
          <Hr className="-mt-8" />
          <div className="px-4 pt-3 pb-4">
            <FieldRow label="제목" className="mt-1">
              <BoxInput
                placeholder="소중한 분들을 초대합니다."
                value={value.title}
                onChange={(s) => patch('title', s)}
                className="w-full max-w-[240px]"
              />
            </FieldRow>

            <FieldRow label="내용" className="mt-4">
              <BoxTextarea
                placeholder="시간을 돌릴 수 있다면, 우리는 언제나 
다시 서로를 선택할 것입니다. 함께하는 
오늘이 늘 가장 특별한 날이 되도록, 이제 
부부로서 평생의 시간을 함께하고자 합니다. 
저희 두 사람의 첫걸음을 축복해 주시면 큰 
기쁨이 되겠습니다."
                value={value.body}
                onChange={(s) => patch('body', s)}
                className="w-full max-w-[240px]"
              />
            </FieldRow>

            <Hr className="my-6" />

            <FieldRow label="정렬">
              <button
                type="button"
                onClick={() => patch('ordered', !value.ordered)}
                className="inline-flex items-center gap-1"
              >
                <CheckBare checked={value.ordered} />
                <span className="pt-1 text-xs font-medium text-text--default">
                  순서대로 정렬
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
        'relative h-8 rounded overflow-hidden',
        'bg-option-box',
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'absolute inset-0 w-full h-full px-2.5',
          '!text-xs font-normal text-text--default placeholder:text-text-secondary',
          'leading-8 bg-transparent outline-none ring-0',
        )}
      />
    </div>
  );
}

function BoxTextarea({
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
        'relative rounded overflow-hidden',
        'bg-option-box',
        className,
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className={clsx(
          'block w-full px-2.5 py-4',
          '!text-xs font-normal text-text--default placeholder:text-text-secondary',
          'leading-tight bg-transparent outline-none resize-none',
        )}
      />
    </div>
  );
}

function CheckBare({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange?: () => void;
  className?: string;
}) {
  return (
    <span
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (onChange && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          onChange();
        }
      }}
      onClick={onChange}
      className={clsx(
        'inline-flex items-center justify-center',
        'w-4 h-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60',
        className,
      )}
    >
      <CheckComponent selected={checked} />
    </span>
  );
}
