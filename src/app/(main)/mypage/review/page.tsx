'use client';

import ReviewForm from '@/components/my/ReviewForm';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const MAX_LEN = 250;

export default function ReviewPage() {
  const sp = useSearchParams();
  const router = useRouter();
  
  const contractId = useMemo(() => Number(sp.get('contractId') ?? '0'), [sp]);
  const vendorName = useMemo(() => {
    const raw = sp.get('vendorName');
    return raw ? decodeURIComponent(raw) : '업체명';
  }, [sp]);

  const invalid = !contractId || Number.isNaN(contractId);

  const {
    rating, setRating,
    good, setGood,
    bad, setBad,
    imageKeys, setImageKeys,
    submitting, errorMsg, doneMsg,
    canSubmit, submit,
  } = useCreateReview({ contractId, maxLen: MAX_LEN });

  useEffect(() => {
    if (invalid) router.replace('/mypage');
  }, [invalid, router]);

  if (invalid) return null;

  return (
    <ReviewForm
      contractId={contractId}
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