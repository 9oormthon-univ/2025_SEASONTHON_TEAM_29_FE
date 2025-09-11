'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';
import CheckComponent from '@/components/invitation/CheckComponent';

export type BasicInfoPerson = {
  lastName: string;
  firstName: string;
  fatherName: string;
  fatherDeceased: boolean;
  motherName: string;
  motherDeceased: boolean;
};

export type BasicInfoValue = {
  groom: BasicInfoPerson;
  bride: BasicInfoPerson;
  order: 'GROOM_FIRST' | 'BRIDE_FIRST';
};

type Props = {
  className?: string;
  title?: string;
  defaultOpen?: boolean;
  value: BasicInfoValue;
  onChange: (next: BasicInfoValue) => void;
};

export default function BasicInfoSection({
  className,
  title = '기본정보',
  defaultOpen = true,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;

  const patch = (
    path:
      | keyof BasicInfoValue
      | 'groom.fatherDeceased'
      | 'groom.motherDeceased'
      | 'bride.fatherDeceased'
      | 'bride.motherDeceased',
    v: any,
  ) => {
    const next = structuredClone(value);
    switch (path) {
      case 'groom':
      case 'bride':
      case 'order':
        (next as any)[path] = v;
        break;
      case 'groom.fatherDeceased':
        next.groom.fatherDeceased = v as boolean;
        break;
      case 'groom.motherDeceased':
        next.groom.motherDeceased = v as boolean;
        break;
      case 'bride.fatherDeceased':
        next.bride.fatherDeceased = v as boolean;
        break;
      case 'bride.motherDeceased':
        next.bride.motherDeceased = v as boolean;
        break;
    }
    onChange(next);
  };

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
        className={clsx(
          'w-full h-[52px] px-4 py-0',
          'inline-flex items-center justify-between',
        )}
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
          <Hr className="my-4" />
          <div className="px-4 pt-3 pb-4">
            <FieldRow label="신랑 정보" className="mt-1">
              <div className="flex items-center gap-2">
                <BoxInput
                  placeholder="성"
                  value={value.groom.lastName}
                  onChange={(s) =>
                    patch('groom', { ...value.groom, lastName: s })
                  }
                  className="w-10"
                />
                <BoxInput
                  placeholder="이름"
                  value={value.groom.firstName}
                  onChange={(s) =>
                    patch('groom', { ...value.groom, firstName: s })
                  }
                  className="w-15"
                />
                <RoleBadge>아들</RoleBadge>
              </div>
            </FieldRow>

            <FieldRow label="아버지" className="mt-4">
              <div className="flex items-center gap-3">
                <BoxInput
                  placeholder="성함"
                  value={value.groom.fatherName}
                  onChange={(s) =>
                    patch('groom', { ...value.groom, fatherName: s })
                  }
                  className="w-24"
                />
                <CheckRow
                  label="故"
                  checked={value.groom.fatherDeceased}
                  onChange={() =>
                    patch('groom.fatherDeceased', !value.groom.fatherDeceased)
                  }
                />
              </div>
            </FieldRow>

            <FieldRow label="어머니" className="mt-4">
              <div className="flex items-center gap-3">
                <BoxInput
                  placeholder="성함"
                  value={value.groom.motherName}
                  onChange={(s) =>
                    patch('groom', { ...value.groom, motherName: s })
                  }
                  className="w-24"
                />
                <CheckRow
                  label="故"
                  checked={value.groom.motherDeceased}
                  onChange={() =>
                    patch('groom.motherDeceased', !value.groom.motherDeceased)
                  }
                />
              </div>
            </FieldRow>

            <Hr className="my-4" />

            <FieldRow label="신부 정보">
              <div className="flex items-center gap-2">
                <BoxInput
                  placeholder="성"
                  value={value.bride.lastName}
                  onChange={(s) =>
                    patch('bride', { ...value.bride, lastName: s })
                  }
                  className="w-10"
                />
                <BoxInput
                  placeholder="이름"
                  value={value.bride.firstName}
                  onChange={(s) =>
                    patch('bride', { ...value.bride, firstName: s })
                  }
                  className="w-14"
                />
                <RoleBadge>딸</RoleBadge>
              </div>
            </FieldRow>

            <FieldRow label="아버지" className="mt-4">
              <div className="flex items-center gap-3">
                <BoxInput
                  placeholder="성함"
                  value={value.bride.fatherName}
                  onChange={(s) =>
                    patch('bride', { ...value.bride, fatherName: s })
                  }
                  className="w-20 md:w-24"
                />
                <CheckRow
                  label="故"
                  checked={value.bride.fatherDeceased}
                  onChange={() =>
                    patch('bride.fatherDeceased', !value.bride.fatherDeceased)
                  }
                />
              </div>
            </FieldRow>

            <FieldRow label="어머니" className="mt-4">
              <div className="flex items-center gap-3">
                <BoxInput
                  placeholder="성함"
                  value={value.bride.motherName}
                  onChange={(s) =>
                    patch('bride', { ...value.bride, motherName: s })
                  }
                  className="w-20 md:w-24"
                />
                <CheckRow
                  label="故"
                  checked={value.bride.motherDeceased}
                  onChange={() =>
                    patch('bride.motherDeceased', !value.bride.motherDeceased)
                  }
                />
              </div>
            </FieldRow>

            <Hr className="my-4" />

            <FieldRow label="항목 순서">
              <button
                type="button"
                onClick={() =>
                  patch(
                    'order',
                    value.order === 'BRIDE_FIRST'
                      ? 'GROOM_FIRST'
                      : 'BRIDE_FIRST',
                  )
                }
                className="inline-flex items-center gap-1 px-1"
              >
                <CheckBare checked={value.order === 'BRIDE_FIRST'} />
                <span className="text-xs font-medium text-text--default">
                  신부 먼저 표기
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
        'h-0 outline-[0.5px] outline-offset-[-0.25px] outline-box-line mb-8',
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
        'min-w-[2rem] bg-option-box',
        className,
      )}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'absolute inset-0 w-full h-full px-2.5',
          'text-xs font-normal text-text--default placeholder:text-text-secondary',
          'leading-8',
          'bg-transparent outline-none ring-0',
        )}
      />
    </div>
  );
}

function RoleBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={clsx(
        'inline-flex h-8 items-center justify-center px-3 rounded select-none pointer-events-none',
        'text-xs font-normal text-text--default bg-primary-200',
      )}
    >
      {children}
    </span>
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
      <CheckBare checked={checked} onChange={onChange} />
      <span className="text-xs leading-normal text-text--secondary">
        {label}
      </span>
    </label>
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
