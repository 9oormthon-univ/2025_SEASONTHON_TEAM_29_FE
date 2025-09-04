'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import SvgObject from '@/components/common/atomic/SvgObject';
import { tokenStore } from '@/lib/tokenStore';

type Props = {
  files: File[];
  total: number;
  onUpload: (files: File[]) => void;
  className?: string;
  domain: string;
  onUrlsChange?: (urls: string[]) => void;
  keyResolver?: (file: File) => string;
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
    <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white ring-1 ring-black/10 shadow-sm">
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
  onChange: (files: File[]) => void;
}) {
  return (
    <label
      className={clsx(
        'w-20 h-20 shrink-0 rounded-xl bg-background',
        'flex flex-col items-center justify-center gap-1 cursor-pointer',
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
          const arr = fl ? Array.from(fl) : [];
          if (arr.length > 0) onChange(arr);
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
  domain,
  onUrlsChange,
  keyResolver,
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const wrapRef = useRef<HTMLDivElement>(null);

  const [canRight, setCanRight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const resolveKey = useMemo(
    () => keyResolver ?? ((f: File) => `${f.name}-${f.lastModified}-${f.size}`),
    [keyResolver],
  );

  const getBearer = () => {
    const raw = tokenStore.get();
    if (!raw) throw new Error('로그인이 필요합니다.');
    return raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
  };

  const checkScroll = () => {
    const el = wrapRef.current;
    if (!el) return;
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
  }, [files]);

  useEffect(() => {
    const el = wrapRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  }, [files.length]);
  const parseUrlList = (json: any): string[] => {
    const extract = (arr: any[]): string[] => {
      if (arr.length === 0) return [];
      if (typeof arr[0] === 'string') return arr as string[];
      if (typeof arr[0] === 'object' && arr[0] && 'presignedUrl' in arr[0]) {
        return arr.map((x: any) => x.presignedUrl as string);
      }
      return [];
    };
    if (Array.isArray(json)) return extract(json);
    if (json && Array.isArray(json.data)) return extract(json.data);
    return [];
  };

  const requestDownloadUrls = useCallback(
    async (keys: string[]) => {
      const res = await fetch(`${API_URL}/v1/s3/${domain}/download-urls`, {
        method: 'POST',
        headers: {
          Authorization: getBearer(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keys),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`download-urls 실패 (${res.status}) ${body}`);
      }
      const json = await res.json();
      const list = parseUrlList(json);
      return list;
    },
    [API_URL, domain],
  );

  const handleUpload = useCallback(
    async (added: File[]) => {
      setError(null);

      console.log(
        '[PhotoCard] 선택된 파일들:',
        added.map((f) => f.name),
      );

      const nextFiles = [...files, ...added].slice(0, total);
      onUpload(added);

      try {
        setLoading(true);
        const keys = nextFiles.map(resolveKey);
        const list = await requestDownloadUrls(keys);
        console.log('[PhotoCard] download URLs (from API):', list);
        setUrls(list);
        onUrlsChange?.(list);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'URL 동기화에 실패했어요.';
        setError(msg);
        console.error('[PhotoCard] download-urls error:', e);
      } finally {
        setLoading(false);
      }
    },
    [files, total, onUpload, resolveKey, requestDownloadUrls, onUrlsChange],
  );

  useEffect(() => {
    console.log('[PhotoCard] download URLs (state):', urls);
  }, [urls]);

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
          onChange={handleUpload}
        />
        {files.map((f, i) => (
          <Thumb key={`${f.name}-${f.lastModified}-${f.size}-${i}`} file={f} />
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
