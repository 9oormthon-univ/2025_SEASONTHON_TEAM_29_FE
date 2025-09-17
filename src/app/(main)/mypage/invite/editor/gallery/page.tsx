'use client';

import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import Button from '@/components/common/atomic/Button';
import Header from '@/components/common/monocules/Header';
import { useRouter, useSearchParams } from 'next/navigation';
import { useS3MultiUpload } from '@/hooks/useS3MultiUpload';
import { useQueryClient } from '@tanstack/react-query';
import LottiePlayer from '@/components/common/atomic/LottiePlayer';

const PER_PAGE = 9;
const TOTAL = 27;
const PAGES = Math.ceil(TOTAL / PER_PAGE);

type Slot = { file: File | null; url: string | null };

export default function Page() {
  const router = useRouter();
  const sp = useSearchParams();
  const draftQ = sp.get('draft');
  const draftId = Number(draftQ);

  const qc = useQueryClient();
  const { uploadAll, uploading, error } = useS3MultiUpload();

  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: TOTAL }, () => ({ file: null, url: null })),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingIndex = useRef<number | null>(null);

  const pages = useMemo(() => Array.from({ length: PAGES }, (_, i) => i), []);

  const handlePick = (idx: number) => {
    pendingIndex.current = idx;
    fileInputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    const idx = pendingIndex.current;
    if (!f || idx == null) return;

    const next = [...slots];
    const prevUrl = next[idx].url;
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    next[idx] = { file: f, url: URL.createObjectURL(f) };
    setSlots(next);

    pendingIndex.current = null;
    e.currentTarget.value = '';
  };

  function staggeredIndices(start: number, count = 9, pageIndex: number) {
    const ids = Array.from({ length: count }, (_, i) => start + i);
    const [a, b, c, d, e, f, g, h, i] = ids;
    const patternA = [a, b, c, null, null, d, e, f, g, h, i, null];
    const patternB = [null, a, b, c, d, e, f, null, null, g, h, i];
    return (pageIndex % 2 === 0 ? patternA : patternB).slice(0, 12) as Array<
      number | null
    >;
  }

  const selectedPairs = slots
    .map((s, i) => (s.file ? { file: s.file, i } : null))
    .filter(Boolean) as { file: File; i: number }[];

  const handleSubmit = async () => {
    if (!Number.isFinite(draftId)) {
      alert('draft 파라미터가 없어 업로드할 수 없어요.');
      return;
    }
    if (selectedPairs.length === 0) {
      alert('업로드할 사진을 선택해 주세요.');
      return;
    }
    try {
      const files = selectedPairs.map((p) => p.file);
      const issued = await uploadAll('INVITATION', draftId, files);
      const mediaList = issued
        .map((u, idx) => ({
          mediaKey: u.s3Key,
          contentType: u.contentType || files[idx].type || '',
          sortOrder: selectedPairs[idx].i,
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      qc.setQueryData(['invitation', 'mediaList', String(draftId)], mediaList);
      alert(`${mediaList.length}장의 사진이 업로드되었습니다.`);
      router.push(`/mypage/invite/editor?draft=${draftId}`);
    } catch (e) {
      console.error(e);
      alert('갤러리 업로드에 실패했어요.');
    }
  };

  return (
    <main className="relative mx-auto flex max-w-[420px] flex-col h-[100svh] bg-white">
      <Header
        value="청첩장 제작"
        showBack
        onBack={() => history.back()}
        rightSlot={
          <a href="editor/view" className="text-xs text-primary-500 underline">
            미리보기
          </a>
        }
      />
      <div className="px-6 pt-6">
        <p className="text-sm font-medium text-text--default">
          실제 청첩장에 들어갈 형태에요
        </p>
        <h2 className="mt-1 text-xl font-bold text-text--default">
          사진을 추가해 주세요.
        </h2>
      </div>

      <div className="mt-25">
        <div className="flex snap-x snap-mandatory overflow-x-auto scroll-pl-6 gap-6 px-6 pb-2">
          {pages.map((p) => {
            const start = p * PER_PAGE;
            const end = Math.min(start + PER_PAGE, TOTAL);
            const indices = staggeredIndices(start, end - start, p);
            return (
              <section
                key={p}
                className="snap-start shrink-0 w-[calc(100vw-48px)] max-w-[372px]"
                aria-label={`page-${p + 1}`}
              >
                <div className="grid grid-cols-4 gap-2">
                  {indices.map((idx, k) =>
                    idx === null ? (
                      <div key={`empty-${k}`} />
                    ) : (
                      <div key={idx} className="relative">
                        <button
                          type="button"
                          onClick={() => handlePick(idx)}
                          className={clsx(
                            'relative w-full overflow-hidden',
                            'outline-1 outline-box-line bg-box-line',
                            'aspect-[3/4]',
                          )}
                        >
                          {!slots[idx]?.url && (
                            <span className="absolute inset-0 grid place-items-center text-xl font-bold text-text--secondary">
                              {idx + 1}
                            </span>
                          )}
                          {slots[idx]?.url && (
                            <Image
                              src={slots[idx].url!}
                              alt={`${idx + 1}번 이미지`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-text--secondary">
        좌우로 움직이면 더 많은 사진을 넣을 수 있어요.
      </p>

      <div className="mt-auto px-6 pb-15 pt-4">
        <Button
          onClick={handleSubmit}
          fullWidth
          disabled={uploading || selectedPairs.length === 0}
        >
          {uploading ? '업로드 중…' : `등록하기 (${selectedPairs.length})`}
        </Button>
        {error && (
          <p className="mt-2 text-center text-xs text-red-600">
            업로드 실패: {error}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploading && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40">
          <div
            role="dialog"
            aria-modal="true"
            className="w-80 h-56 relative rounded-lg bg-white shadow-xl"
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-6 text-center text-text--default text-base font-semibold">
              두 분의 소중한 추억을
              <br />
              예쁘게 담는 중이에요
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-[80px] w-36 h-32">
              <LottiePlayer src="/loading.json" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
