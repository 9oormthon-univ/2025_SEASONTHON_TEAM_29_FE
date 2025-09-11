'use client';

import React, {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';
import CheckComponent from '@/components/invitation/CheckComponent';

export type DateSectionValue = {
  date: string;
  hour: number;
  minute: number;
  showCountdown: boolean;
};

type Props = {
  className?: string;
  title?: string;
  defaultOpen?: boolean;
  value: DateSectionValue;
  onChange: (next: DateSectionValue) => void;
  minuteStep?: 5 | 10 | 15;
};

export default function DateSection({
  className,
  title = '예약 일시',
  defaultOpen = true,
  value,
  onChange,
  minuteStep = 10,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [calOpen, setCalOpen] = useState(false);
  const sectionId = useId();
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;
  const dateBtnRef = useRef<HTMLButtonElement | null>(null);

  const minutes = useMemo(
    () =>
      Array.from(
        { length: Math.floor(60 / minuteStep) },
        (_, i) => i * minuteStep,
      ),
    [minuteStep],
  );

  const hourOptions = useMemo(
    () =>
      Array.from({ length: 24 }, (_, h) => ({
        value: h,
        label: formatHourLabel(h),
      })),
    [],
  );
  const minuteOptions = useMemo(
    () =>
      minutes.map((m) => ({
        value: m,
        label: `${m.toString().padStart(2, '0')}분`,
      })),
    [minutes],
  );

  const patch = <K extends keyof DateSectionValue>(
    key: K,
    v: DateSectionValue[K],
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
            <FieldRow label="예식일" className="mt-1">
              <DateButton
                ref={dateBtnRef}
                label={value.date || 'YYYY-MM-DD'}
                onClick={() => setCalOpen((v) => !v)}
              />
            </FieldRow>

            <FieldRow label="예식시간" className="mt-4">
              <div className="flex items-center gap-2">
                <Dropdown
                  className="w-24"
                  options={hourOptions}
                  selected={value.hour}
                  onSelect={(h) => patch('hour', h)}
                />
                <Dropdown
                  className="w-18"
                  options={minuteOptions}
                  selected={value.minute}
                  onSelect={(m) => patch('minute', m)}
                />
              </div>
            </FieldRow>

            <Hr className="my-4" />

            <FieldRow label="표시">
              <button
                type="button"
                onClick={() => patch('showCountdown', !value.showCountdown)}
                className="inline-flex items-center gap-1 px-1"
              >
                <CheckComponent selected={value.showCountdown} />
                <span className="text-xs font-medium text-text--default">
                  디데이 카운트다운
                </span>
              </button>
            </FieldRow>
          </div>
        </div>
      )}
      <CalendarPopover
        open={calOpen}
        anchorRef={dateBtnRef}
        value={value.date}
        onSelect={(iso) => {
          patch('date', iso);
          setCalOpen(false);
        }}
        onClose={() => setCalOpen(false)}
      />
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

const DateButton = forwardRef<
  HTMLButtonElement,
  { label: string; onClick: () => void }
>(function DateButtonInner({ label, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={clsx(
        '!w-23 h-8 px-2 rounded bg-option-box',
        'inline-flex items-center justify-between gap-2 w-60 text-left',
      )}
    >
      <span className="text-text--default text-xs leading-9">{label}</span>
    </button>
  );
});
type Opt = { value: number | string; label: string };

function Dropdown({
  options,
  selected,
  onSelect,
  className,
}: {
  options: readonly Opt[];
  selected: number | string;
  onSelect: (v: any) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const sel = options.find((o) => o.value === selected) ?? options[0];

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'h-8 px-3 rounded bg-option-box',
          'inline-flex items-center justify-between gap-2 text-left',
          className,
        )}
      >
        <span className="text-text--default text-xs leading-9">
          {sel.label}
        </span>
        <SvgObject src="/icons/down.svg" alt="" width={12} height={6} />
      </button>

      <DropdownPopover
        open={open}
        anchorRef={btnRef}
        options={options}
        selected={selected}
        onSelect={(v) => {
          onSelect(v);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

function DropdownPopover({
  open,
  anchorRef,
  options,
  selected,
  onSelect,
  onClose,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  options: readonly Opt[];
  selected: number | string;
  onSelect: (v: number | string) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: -9999,
    left: -9999,
    width: 0,
  });

  useLayoutEffect(() => {
    if (!open) return;
    const a = anchorRef.current;
    if (!a) return;
    const update = () => {
      const r = a.getBoundingClientRect();
      const gap = 6;
      setPos({
        top: Math.min(r.bottom + gap, window.innerHeight - 200),
        left: Math.min(Math.max(8, r.left), window.innerWidth - r.width - 8),
        width: r.width,
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const p = panelRef.current;
      if (!p || !(e.target instanceof Node)) return;
      if (
        !p.contains(e.target) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      <div
        ref={panelRef}
        className="absolute pointer-events-auto max-h-56 overflow-auto rounded-md outline-[1.2px] outline-offset-[-1.2px] outline-box-line bg-background shadow"
        style={{ top: pos.top, left: pos.left, width: pos.width }}
        role="listbox"
      >
        {options.map((o) => {
          const active = o.value === selected;
          return (
            <button
              key={`${o.value}`}
              type="button"
              onClick={() => onSelect(o.value)}
              className={clsx(
                'w-full h-8 px-2 text-left !text-[11px] flex items-center justify-between',
                active ? 'bg-primary-200 text-text--default' : '',
              )}
              role="option"
              aria-selected={active}
            >
              <span>{o.label}</span>
              {active && (
                <SvgObject
                  src="/icons/check.svg"
                  alt=""
                  width={12}
                  height={12}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>,
    document.body,
  );
}
function CalendarPopover({
  open,
  anchorRef,
  value,
  onSelect,
  onClose,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  value?: string;
  onSelect: (iso: string) => void;
  onClose: () => void;
}) {
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: -9999,
    left: -9999,
  });
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [view, setView] = useState<{ y: number; m: number }>(() => {
    const init = value ? parseISO(value) : new Date();
    return { y: init.getFullYear(), m: init.getMonth() };
  });

  useEffect(() => {
    if (!open) return;
    const init = value ? parseISO(value) : new Date();
    setView({ y: init.getFullYear(), m: init.getMonth() });
  }, [open, value]);

  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    if (!anchor) return;

    const update = () => {
      const r = anchor.getBoundingClientRect();
      const gap = 8;
      const width = 256;
      const left = Math.min(Math.max(8, r.left), window.innerWidth - width - 8);
      const top = Math.min(r.bottom + gap, window.innerHeight - 280);
      setPos({ top, left });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const p = panelRef.current;
      if (!p || !(e.target instanceof Node)) return;
      if (
        !p.contains(e.target) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const first = new Date(view.y, view.m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const leading: (Date | null)[] = Array.from(
    { length: startDay },
    () => null as null,
  );
  const monthDays: Date[] = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(view.y, view.m, i + 1),
  );
  const cells: (Date | null)[] = [...leading, ...monthDays];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedISO = value ?? '';
  const headerLabel = `${view.y}년 ${view.m + 1}월`;

  return createPortal(
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      <div
        ref={panelRef}
        className="absolute pointer-events-auto w-64 rounded-lg outline-[1.2px] outline-offset-[-1.2px] outline-box-line bg-background shadow"
        style={{ top: pos.top, left: pos.left }}
        role="dialog"
        aria-label="달력"
      >
        <div className="p-3">
          <div className="flex items-center justify-between">
            <button
              className="p-1 "
              onClick={() => {
                const d = new Date(view.y, view.m - 1, 1);
                setView({ y: d.getFullYear(), m: d.getMonth() });
              }}
              aria-label="이전 달"
            >
              ‹
            </button>
            <div className="text-xs font-medium text-text--default">
              {headerLabel}
            </div>
            <button
              className="p-1 "
              onClick={() => {
                const d = new Date(view.y, view.m + 1, 1);
                setView({ y: d.getFullYear(), m: d.getMonth() });
              }}
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-[10px] text-text--secondary">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <div key={d} className="h-6 flex items-center justify-center">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, idx) => {
              if (!d) return <div key={`empty-${idx}`} className="h-8" />;
              const iso = toISODate(d);
              const isSelected = iso === selectedISO;
              const isToday = toISODate(new Date()) === iso;
              return (
                <button
                  key={iso}
                  onClick={() => onSelect(iso)}
                  className={clsx(
                    'h-8 rounded flex items-center justify-center text-xs',
                    isSelected ? 'bg-primary-200 text-text--default' : '',
                    !isSelected && isToday && 'outline-primary-300',
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
function formatHourLabel(h: number) {
  const meridiem = h < 12 ? 'A.M.' : 'P.M.';
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${meridiem} ${twelve}시`;
}
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseISO(iso: string) {
  const [y, m, d] = iso.split('-').map((v) => parseInt(v, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}
