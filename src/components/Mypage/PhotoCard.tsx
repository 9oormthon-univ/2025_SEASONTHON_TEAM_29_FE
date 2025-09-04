'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SvgObject from '@/components/common/atomic/SvgObject';

type Props = {
  files: File[];
  total: number;
  onUpload: (files: FileList) => void;
  className?: string;
};

function useObjectURL(file?: File) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function Thumb({ file }: { file: File }) {
  const url = useObjectURL(file);
  return (
    <div
      className="
        relative w-20 h-20 shrink-0
        rounded-xl overflow-hidden bg-white
        ring-1 ring-black/10 shadow-sm
      "
    >
      {url && (
        <Image
          src={url}
          alt={file.name}
          fill
          className="object-cover"
          unoptimized
          sizes="80px"
        />
      )}
    </div>
  );
}

function UploadTile({
  current,
  total,
  disabled,
  onChange,
}: {
  current: number;
  total: number;
  disabled?: boolean;
  onChange: (files: FileList) => void;
}) {
  return (
    <label
      className={clsx(
        'w-20 h-20 shrink-0 rounded-xl bg-background',
        'flex flex-col items-center justify-center gap-1.5 cursor-pointer',
        'outline-[1.2px] outline-offset-[-1.2px] outline-box-line',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <SvgObject
        src="/icons/photo.svg"
        alt="사진 추가"
        width={20}
        height={20}
        className="mb-0.5"
      />
      <span className="text-xs leading-none text-text-secondary">
        사진 {current}/{total}
      </span>
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        disabled={disabled}
        onChange={(e) => {
          const fl = e.currentTarget.files;
          if (fl && fl.length > 0) onChange(fl);
          e.currentTarget.value = '';
        }}
      />
    </label>
  );
}

export default function PhotoCard({
  files,
  total,
  onUpload,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = () => {
    const el = wrapRef.current;
    if (!el) return;
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
  }, [files]);

  const isFull = files.length >= total;

  return (
    <div className={clsx('relative', className)}>
      <div
        ref={wrapRef}
        onScroll={checkScroll}
        className="flex items-center gap-1 overflow-x-auto py-2 pr-10 scrollbar-thin"
      >
        <UploadTile
          current={files.length}
          total={total}
          disabled={isFull}
          onChange={onUpload}
        />
        {files.map((f, i) => (
          <Thumb key={`${f.name}-${i}`} file={f} />
        ))}
      </div>

      {canRight && (
        <button
          type="button"
          aria-label="오른쪽으로 더 보기"
          onClick={() =>
            wrapRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow flex items-center justify-center border border-gray-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
