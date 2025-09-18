'use client';

import SvgObject from '@/components/common/atomic/SvgObject';
import { tokenStore } from '@/lib/tokenStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type Domain = 'VENDOR' | 'REVIEW';

type Props = {
  files: File[];
  total: number;
  onUploadSelect: (files: File[]) => void;
  className?: string;
  domain: Domain;
  domainId: number;
  onUploaded?: (s3Keys: string[]) => void;
  onPresignedUrls?: (urls: string[]) => void;
  concurrency?: number;
  acceptMimes?: string[];
  maxFileSize?: number;
  onRemoveAt?: (index: number) => void;
};

type UploadReqItem = {
  domainId: number;
  filename: string;
  contentType: string;
  contentLength: number;
};

type UploadUrlRespItem = {
  s3Key: string;
  presignedUrl: string;
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

function Thumb({ file, onRemove }: { file: File; onRemove?: () => void }) {
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

      {/* ✅ 우측 상단 X 버튼 */}
      {onRemove && (
        <button
          type="button"
          aria-label="사진 삭제"
          onClick={onRemove}
          className={clsx(
            'absolute top-1 right-1 size-5 rounded-full',
            'bg-neutral-200 text-neutral-700 hover:bg-neutral-300',
            'flex items-center justify-center shadow ring-1 ring-black/10'
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
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

function parsePresignedResponse(json: unknown): UploadUrlRespItem[] {
  const raw: unknown[] = Array.isArray(json)
    ? json
    : typeof json === 'object' &&
        json !== null &&
        Array.isArray((json as Record<string, unknown>).data)
      ? (json as { data: unknown[] }).data
      : [];

  return raw.filter(
    (x): x is UploadUrlRespItem =>
      typeof x === 'object' &&
      x !== null &&
      typeof (x as Record<string, unknown>).presignedUrl === 'string' &&
      typeof (x as Record<string, unknown>).s3Key === 'string',
  );
}

export default function PhotoCard({
  files,
  total,
  onUploadSelect,
  className,
  domain,
  domainId,
  onUploaded,
  onPresignedUrls,
  concurrency,
  acceptMimes = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 20 * 1024 * 1024,
  onRemoveAt
}: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const wrapRef = useRef<HTMLDivElement>(null);

  const [canRight, setCanRight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string | null>(null);

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

  const getPresignedUploadUrls = useCallback(
    async (items: UploadReqItem[]): Promise<UploadUrlRespItem[]> => {
      const res = await fetch(`${API_URL}/v1/s3/${domain}/upload-urls`, {
        method: 'PUT',
        headers: {
          Authorization: getBearer(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`upload-urls 실패 (${res.status}) ${text}`);
      const json = text ? JSON.parse(text) : null;
      const list = parsePresignedResponse(json);
      onPresignedUrls?.(list.map((x) => x.presignedUrl));
      return list;
    },
    [API_URL, domain, onPresignedUrls],
  );

  const putToS3 = async (presignedUrl: string, file: File) => {
    const res = await fetch(presignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`S3 업로드 실패 ${res.status}: ${t}`);
    }
  };

  const handleUpload = useCallback(
    async (added: File[]) => {
      setError(null);

      const bad = added.filter(
        (f) =>
          (acceptMimes.length && !acceptMimes.includes(f.type)) ||
          f.size > maxFileSize,
      );
      if (bad.length) {
        setError('허용되지 않는 파일이 있습니다.');
        return;
      }

      onUploadSelect(added);

      try {
        setLoading(true);
        setProgressText('URL 발급 중…');

        const reqItems: UploadReqItem[] = added.map((f) => ({
          domainId,
          filename: f.name,
          contentType: f.type || 'application/octet-stream',
          contentLength: f.size,
        }));
        const presignedList = await getPresignedUploadUrls(reqItems);

        const limit = Math.max(1, concurrency ?? 3);
        let idx = 0;
        const workers = Array.from({ length: limit }, async () => {
          while (idx < presignedList.length) {
            const i = idx++;
            const { presignedUrl, s3Key } = presignedList[i];
            const file = added[i];
            await putToS3(presignedUrl, file);
            console.log(
              `[업로드 완료] file=${file.name}, s3Key=${s3Key}, url=${presignedUrl}`,
            );
          }
        });
        await Promise.all(workers);

        setProgressText('업로드 완료 정리 중…');
        const s3Keys = presignedList.map((x) => x.s3Key);
        console.log('[최종 업로드 리스트]', presignedList);
        onUploaded?.(s3Keys);
        setProgressText(null);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '업로드에 실패했어요.';
        setError(msg);
        console.error('[PhotoCard] 업로드 에러:', e);
        setProgressText(null);
      } finally {
        setLoading(false);
      }
    },
    [
      onUploadSelect,
      domainId,
      getPresignedUploadUrls,
      concurrency,
      acceptMimes,
      maxFileSize,
      onUploaded,
    ],
  );

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
          <Thumb
            key={`${f.name}-${f.lastModified}-${f.size}-${i}`}
            file={f}
            onRemove={() => {
              // 부모에게 콜백 전달
              if (typeof onRemoveAt === 'function') {
                onRemoveAt(i);
              }
            }}
          />
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

      {loading && (
        <p className="mt-2 text-xs text-text--secondary">
          {progressText ?? '처리 중…'}
        </p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
