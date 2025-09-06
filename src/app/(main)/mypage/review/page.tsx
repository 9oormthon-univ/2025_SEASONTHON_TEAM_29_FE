'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/common/monocules/Header';
import Button from '@/components/common/atomic/Button';
import PhotoCard from '@/components/Mypage/PhotoCard';
import RingRating from '@/components/reviews/RingRating';
import TextField from '@/components/common/atomic/TextField';
import { tokenStore } from '@/lib/tokenStore';

const MAX_PHOTOS = 5;
const MAX_LEN = 250;

export default function ReviewPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const router = useRouter();
  const redirectTimerRef = useRef<number | null>(null);

  const searchParams = useSearchParams();
  const vendorIdFromUrl = Number(searchParams.get('vendorId') ?? '0');
  const vendorNameFromUrl = searchParams.get('vendorName')
    ? decodeURIComponent(searchParams.get('vendorName')!)
    : '업체명';

  const [files, setFiles] = useState<File[]>([]);
  const [good, setGood] = useState('');
  const [bad, setBad] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);
  const [imageKeys, setImageKeys] = useState<string[]>([]);

  useEffect(() => {
    if (!vendorIdFromUrl) setErrorMsg('존재하지 않는 업체입니다.');
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, [vendorIdFromUrl]);

  const vendorName = vendorNameFromUrl || '업체명';
  const vendorId = vendorIdFromUrl || 0;
  const canSubmit = rating !== null && good.trim().length > 0 && !submitting;

  const getBearer = () => {
    const raw = tokenStore.get();
    if (!raw) throw new Error('로그인이 필요합니다.');
    return raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
  };

  const submitReview = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMsg(null);
    setDoneMsg(null);

    try {
      const res = await fetch(`${API_URL}/v1/review/create`, {
        method: 'POST',
        headers: {
          Authorization: getBearer(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorId,
          rating: rating!,
          contentBest: good.trim(),
          contentWorst: bad.trim(),
          imageKeys,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`후기 등록 실패 (${res.status}) ${text}`);
      }

      setDoneMsg('후기가 등록되었어요! ');
      redirectTimerRef.current = window.setTimeout(() => {
        router.replace('/mypage');
      }, 5000);
    } catch (e: unknown) {
      setErrorMsg(
        e instanceof Error ? e.message : '후기 등록 중 오류가 발생했어요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-96 px-6 pb-36">
        <Header value="후기" />

        <section className="mt-2 text-center">
          <h1 className="text-sm font-medium text-text--default">
            {vendorName}
          </h1>
          <p className="mt-1 text-xs text-text--secondary">
            {vendorName}이 만족스러우셨다면 리뷰를 남겨주세요.
          </p>
          <div className="mt-3 flex justify-center">
            <RingRating max={5} value={rating} onChange={setRating} />
          </div>
        </section>

        <section className="mt-5">
          <PhotoCard
            files={files}
            total={MAX_PHOTOS}
            domain="REVIEW"
            domainId={vendorId}
            onUploadSelect={(added) =>
              setFiles((s) => [...s, ...added].slice(0, MAX_PHOTOS))
            }
            onUploaded={(s3Keys) => {
              setImageKeys((prev) => {
                const next = Array.from(new Set([...prev, ...s3Keys]));
                return next.slice(0, MAX_PHOTOS);
              });
              console.log('[DONE] s3Keys:', s3Keys);
            }}
          />
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-medium text-text--default">좋았던 점</h2>
          <TextField
            value={good}
            onChange={setGood}
            maxLength={MAX_LEN}
            placeholder="좋았던 점을 적어주세요."
            className="w-80 h-52"
          />
        </section>

        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-medium text-text--default">아쉬운 점</h2>
          <TextField
            value={bad}
            onChange={setBad}
            maxLength={MAX_LEN}
            placeholder="아쉬웠던 점을 적어주세요."
            className="w-80 h-52"
          />
        </section>

        {errorMsg && <p className="mt-3 text-xs text-red-500">{errorMsg}</p>}
        {doneMsg && <p className="mt-3 text-xs text-primary-500">{doneMsg}</p>}
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="w-96 px-6 pb-[env(safe-area-inset-bottom)]">
          <Button
            size="lg"
            state={canSubmit ? 'default' : 'inactive'}
            disabled={!canSubmit}
            fullWidth
            onClick={submitReview}
          >
            {submitting ? '등록 중…' : '등록하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
