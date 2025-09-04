'use client';

import { useState } from 'react';
import Header from '@/components/common/monocules/Header';
import Button from '@/components/common/atomic/Button';
import PhotoCard from '@/components/Mypage/PhotoCard';
import RingRating from '@/components/reviews/RingRating';
import TextField from '@/components/common/atomic/TextField';

const MAX_PHOTOS = 5;
const MAX_LEN = 250;

export default function ReviewPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [good, setGood] = useState('');
  const [bad, setBad] = useState('');
  const [rating, setRating] = useState<number>(0);
  const vendor = '그레이스케일';

  const canSubmit = rating > 0 && good.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-96 px-6 pb-36">
        <Header value="후기" />
        <section className="mt-2 text-center">
          <h1 className="text-sm font-medium text-text--default">{vendor}</h1>
          <p className="mt-1 text-xs text-text--secondary">
            {vendor}이 만족스러우셨다면 리뷰를 남겨주세요.
          </p>
          <div className="mt-3 flex justify-center">
            <RingRating max={5} onChange={setRating} />
          </div>
        </section>
        <section className="mt-5">
          <PhotoCard
            files={files}
            total={MAX_PHOTOS}
            domain="vendor"
            onUrlsChange={setPhotoUrls}
            onUpload={(fl) =>
              setFiles((prev) =>
                [...prev, ...Array.from(fl)].slice(0, MAX_PHOTOS),
              )
            }
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
      </div>
      <div className="fixed bottom-6 left-0 right-0 flex justify-center">
        <div className="w-96 px-6 pb-[env(safe-area-inset-bottom)]">
          <Button
            size="lg"
            state={canSubmit ? 'default' : 'inactive'}
            disabled={!canSubmit}
            fullWidth
            onClick={() => {
              console.log({
                vendor,
                rating,
                good,
                bad,
                filesCount: files.length,
                photoUrls,
              });
            }}
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
