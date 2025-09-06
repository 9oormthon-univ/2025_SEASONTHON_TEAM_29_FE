'use client';

import ReviewForm from '@/components/my/ReviewForm';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const MAX_LEN = 250;

export default function ReviewPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const vendorId = useMemo(() => Number(sp.get('vendorId') ?? '0'), [sp]);
  const vendorName = useMemo(() => {
    const raw = sp.get('vendorName');
    return raw ? decodeURIComponent(raw) : '업체명';
  }, [sp]);

  const invalid = !vendorId || Number.isNaN(vendorId);

  // ✅ 훅은 항상 호출
  const {
    rating, setRating,
    good, setGood,
    bad, setBad,
    imageKeys, setImageKeys,
    submitting, errorMsg, doneMsg,
    canSubmit, submit,
  } = useCreateReview({ vendorId, maxLen: MAX_LEN });

  // ✅ 잘못된 접근은 이펙트로 리다이렉트
  useEffect(() => {
    if (invalid) router.replace('/mypage');
  }, [invalid, router]);

  // ✅ 렌더만 막기 (훅은 이미 호출됐기 때문에 규칙 위반 아님)
  if (invalid) return null;

  return (
    <ReviewForm
      vendorId={vendorId}
      vendorName={vendorName}
      good={good}
      setGood={setGood}
      bad={bad}
      setBad={setBad}
      rating={rating}
      setRating={setRating}
      imageKeys={imageKeys}
      setImageKeys={setImageKeys}
      canSubmit={canSubmit}
      submitting={submitting}
      errorMsg={errorMsg}
      doneMsg={doneMsg}
      onSubmit={submit}
      maxLen={MAX_LEN}
    />
  );
}