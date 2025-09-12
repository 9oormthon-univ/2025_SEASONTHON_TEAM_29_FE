'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';
import CheckComponent from '@/components/invitation/CheckComponent';
import PhotoCard from '@/components/invitation/PhotoCard';

type LayoutType = 'GRID' | 'SWIPE';
type UploadDomain = 'VENDOR' | 'REVIEW';

export type GallerySectionValue = {
  layout: LayoutType;
  enablePopup: boolean;
  photos: string[];
};

type Props = {
  className?: string;
  title?: string;
  defaultOpen?: boolean;
  value: GallerySectionValue;
  onChange: (next: GallerySectionValue) => void;
  uploadDomain: UploadDomain;
  uploadDomainId: number;
  maxTotal?: number;
  concurrency?: number;
};

export default function GallerySection({
  className,
  title = '갤러리',
  defaultOpen = false,
  value,
  onChange,
  uploadDomain,
  uploadDomainId,
  maxTotal = 27,
  concurrency = 3,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const sectionId = useId();
  const headerId = `${sectionId}-header`;
  const panelId = `${sectionId}-panel`;
  const [files, setFiles] = useState<File[]>([]);

  const handleSelectFiles = (added: File[]) => {
    if (!added?.length) return;
    const room = Math.max(0, maxTotal - files.length);
    if (room <= 0) return;
    setFiles((prev) => [...prev, ...added.slice(0, room)]);
  };

  const patch = <K extends keyof GallerySectionValue>(
    key: K,
    v: GallerySectionValue[K],
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
          width={12}
          height={6}
          className={clsx(
            'transition-transform opacity-60',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headerId}>
          <Hr className="-mt-8" />

          <div className="px-4 pt-3 pb-6">
            <FieldRow label="배치" className="mt-1">
              <div className="flex items-center gap-2">
                <Pill
                  selected={value.layout === 'GRID'}
                  onClick={() => patch('layout', 'GRID')}
                >
                  그리드
                </Pill>
                <Pill
                  selected={value.layout === 'SWIPE'}
                  onClick={() => patch('layout', 'SWIPE')}
                >
                  스와이프
                </Pill>
              </div>
            </FieldRow>
            <div className="mt-3 pl-20">
              <PhotoCard
                files={files}
                total={maxTotal}
                linkTo="mypage/invite/editor/gallery"
              />
            </div>

            <Hr className="my-4" />
            <FieldRow label="팝업뷰어">
              <button
                type="button"
                onClick={() => patch('enablePopup', !value.enablePopup)}
                className="inline-flex items-center gap-1 px-1"
              >
                <CheckComponent selected={value.enablePopup} />
                <span className="text-xs font-medium text-text--default">
                  사진 클릭시, 팝업뷰어 가능
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
        'px-4 h-9 rounded-full',
        'outline-1 outline-offset-[-1px]',
        selected ? 'bg-primary-200 outline-primary-300' : 'outline-box-line',
        'flex items-center justify-center',
      )}
    >
      <span className="text-xs leading-9 text-text--default">{children}</span>
    </button>
  );
}
