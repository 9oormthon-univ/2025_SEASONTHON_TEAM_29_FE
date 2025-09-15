
import { getErrorMessage } from '@/services/mypage.api';
import { createReview, type CreateReviewPayload } from '@/services/review.api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useCreateReview({
  vendorId,
  maxLen = 250,
  redirectMs = 5000,
}: {
  vendorId: number;
  maxLen?: number;
  redirectMs?: number;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [good, setGood] = useState('');
  const [bad, setBad] = useState('');
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  const router = useRouter();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const canSubmit =
    !!vendorId &&
    rating !== null &&
    rating >= 1 &&
    rating <= 5 &&
    good.trim().length > 0 &&
    good.length <= maxLen &&
    bad.length <= maxLen &&
    !submitting;

  const submit = useCallback(async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMsg(null);
    setDoneMsg(null);
    
    const payload: CreateReviewPayload = {
      vendorId,
      rating: rating!,
      contentBest: good.trim(),
      contentWorst: bad.trim(),
      mediaList: imageKeys.map((key, i) => ({
        mediaKey: key,
        contentType: 'image/jpeg', // 실제 업로드 시점에서 받아온 MIME 타입
        sortOrder: i,
      })),
    };

    try {
      const res = await createReview(payload);
      // http()는 실패 시 throw, 성공 시 ApiEnvelope 반환
      if (res?.status && res.status >= 400) {
        throw new Error(res?.message || '후기 등록에 실패했어요.');
      }
      setDoneMsg('후기가 등록되었어요!');
      timerRef.current = window.setTimeout(() => {
        router.replace('/mypage');
      }, redirectMs);
    } catch (e) {
      setErrorMsg(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, vendorId, rating, good, bad, imageKeys, router, redirectMs]);

  return {
    // state
    rating, setRating,
    good, setGood,
    bad, setBad,
    imageKeys, setImageKeys,
    submitting, errorMsg, doneMsg,
    // derived
    canSubmit,
    // actions
    submit,
  };
}