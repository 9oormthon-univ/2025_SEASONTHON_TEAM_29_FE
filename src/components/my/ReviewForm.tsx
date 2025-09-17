'use client';

import Button from '@/components/common/atomic/Button';
import TextField from '@/components/common/atomic/TextField';
import Header from '@/components/common/monocules/Header';
import RingRating from '@/components/reviews/RingRating';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import PhotoCard from './PhotoCard';

const MAX_PHOTOS = 5;

export type ReviewFormProps = {
  contractId: number;
  vendorName: string;
  good: string;
  setGood: (v: string) => void;
  bad: string;
  setBad: (v: string) => void;
  rating: number | null;
  setRating: (v: number | null) => void;
  imageKeys: string[];
  setImageKeys: Dispatch<SetStateAction<string[]>>;
  canSubmit: boolean;
  submitting: boolean;
  errorMsg: string | null;
  doneMsg: string | null;
  onSubmit: () => void;
  maxLen?: number;
};

export default function ReviewForm({
  contractId,
  vendorName,
  good, setGood,
  bad, setBad,
  rating, setRating,
  setImageKeys,
  canSubmit, submitting, errorMsg, doneMsg,
  onSubmit,
  maxLen = 250,
}: ReviewFormProps) {
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  return (
    <main className="min-h-screen bg-background pb-24">
      <Header showBack onBack={()=>router.push('/mypage')} value="후기" />
      <div className="w-96 px-6 pb-36">
        {/* 헤더 & 평점 */}
        <section className="mt-2 text-center">
          <h1 className="text-sm font-medium text-text--default">{vendorName}</h1>
          <p className="mt-1 text-xs text-text--secondary">
            {vendorName}이 만족스러우셨다면 리뷰를 남겨주세요.
          </p>
          <div className="mt-3 flex justify-center">
            <RingRating max={5} value={rating} onChange={setRating} />
          </div>
        </section>

        {/* 사진 업로드 */}
        <section className="mt-5">
          <PhotoCard
            files={files}
            total={MAX_PHOTOS}
            domain="REVIEW"
            domainId={contractId}
            onUploadSelect={(added) =>
              setFiles((s) => [...s, ...added].slice(0, MAX_PHOTOS))
            }
            onUploaded={(s3Keys) => {
              setImageKeys((prev) => {
                const next = Array.from(new Set([...(prev ?? []), ...s3Keys]));
                return next.slice(0, MAX_PHOTOS);
              });
            }}
            onRemoveAt={(idx) => {
              setFiles((s) => s.filter((_, i) => i !== idx));
            }}
          />
        </section>

        {/* 텍스트 입력 */}
        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-medium text-text--default">좋았던 점</h2>
          <TextField
            value={good}
            onChange={setGood}
            maxLength={maxLen}
            placeholder="좋았던 마음을 담아주세요."
            className="w-full h-[180px]"
          />
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-medium text-text--default">아쉬운 점</h2>
          <TextField
            value={bad}
            onChange={setBad}
            maxLength={maxLen}
            placeholder="솔직한 마음을 담아주세요."
            className="w-full h-[180px]"
          />
        </section>

        {/* 메시지 */}
        {errorMsg && <p className="mt-3 text-xs text-red-500">{errorMsg}</p>}
        {doneMsg && <p className="mt-3 text-xs text-primary-500">{doneMsg}</p>}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="w-96 px-6 pb-[env(safe-area-inset-bottom)]">
          <Button
            size="lg"
            state={canSubmit ? 'default' : 'inactive'}
            disabled={!canSubmit}
            fullWidth
            onClick={onSubmit}
          >
            {submitting ? '등록 중…' : '등록하기'}
          </Button>
        </div>
      </div>
    </main>
  );
}