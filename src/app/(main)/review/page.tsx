'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/common/monocules/Header';
import CompanyLongCard from '@/components/reviews/CompanyLongCard';
import RingRating from '@/components/reviews/RingRating';
import Imagebox from '@/components/reviews/ImageBox';

type ReviewData = {
  reviewId: number;
  rating: number;
  contentBest: string;
  contentWorst: string;
  imagesUrls: string[];
  createdAt: string;
  writerName: string;
  writerType: 'BRIDE' | 'GROOM' | string;
  weddingDday: string;
  vendorId: number;
  vendorName: string;
  vendorLogoUrl: string;
  vendorCategory: 'WEDDING_HALL' | 'DRESS' | 'MAKEUP' | 'STUDIO' | string;
};
type CompanyType = '웨딩홀' | '드레스' | '메이크업' | '스튜디오';
const CATEGORY_MAP: Record<ReviewData['vendorCategory'], CompanyType> = {
  WEDDING_HALL: '웨딩홀',
  DRESS: '드레스',
  MAKEUP: '메이크업',
  STUDIO: '스튜디오',
};

const fmtDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}.${m}.${day}`;
};

const MOCK_REVIEW: ReviewData = {
  reviewId: 125,
  rating: 4,
  contentBest:
    '아펠가모 반포에서 예식을 진행했는데 만족스러웠어요!\n우선 홀에 처음 입장할 때부터 조명이랑 음악이 어우러져서 저도 모르게 울컥하더라고요. 홀 자체가 천장이 높고 채광이 좋아서 화사한 분위기가 연출됐고, 플라워 데코도 사진으로 보던 것보다 훨씬 풍성해서 만족했어요💛',
  contentWorst:
    '하객 수가 많다 보니 대기 공간이 조금 좁게 느껴져서 부모님 친구분들이 잠깐 불편하셨다는 피드백도 들었어요🥹그래도 후회 없는 선택이었습니다!!',
  imagesUrls: [
    'https://placehold.co/800x1000',
    'https://placehold.co/80x100',
    'https://placehold.co/80x100',
    'https://placehold.co/80x100',
  ],
  createdAt: '2025-08-31T12:00:00',
  writerName: '이유빈',
  writerType: 'BRIDE',
  weddingDday: 'D-278',
  vendorId: 42,
  vendorName: '아펠가모 반포',
  vendorLogoUrl: '/apelgamo.jpg',
  vendorCategory: 'WEDDING_HALL',
};

export default function ReviewDetailPage() {
  const [data, setData] = useState<ReviewData | null>(null);
  const [imagebox, setImagebox] = useState<{ open: boolean; idx: number }>({
    open: false,
    idx: 0,
  });
  useEffect(() => {
    setData(MOCK_REVIEW);
  }, []);

  const categoryKo = useMemo<CompanyType>(() => {
    return data ? (CATEGORY_MAP[data.vendorCategory] ?? '웨딩홀') : '웨딩홀';
  }, [data]);
  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Header value="리뷰상세" />

      {data && (
        <>
          <section className="px-5 mt-3 flex items-center gap-3">
            <div className="w-14 h-16 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/pinkProfile.svg"
                alt="profile"
                width={56}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-text--default">
                {`${data.writerName} ${
                  data.writerType === 'BRIDE' ? '신부님' : '신랑님'
                }`}
              </div>
            </div>
          </section>
          <section className="px-5 mt-5">
            <CompanyLongCard
              className="w-full"
              title={data.vendorName}
              logoUrl={data.vendorLogoUrl}
              date={fmtDate(data.createdAt)}
              type={categoryKo}
              onReport={() => alert('신고하기 눌림')}
            />
          </section>

          <section className="px-5 mt-6">
            <div className="w-full flex flex-col items-center">
              <div className="text-sm font-medium text-text--default">
                웨딧링 점수
              </div>
              <div className="mt-2">
                <RingRating value={data.rating} />
              </div>
              <div className="mt-2 text-xs font-medium text-black">
                {data.rating}점
              </div>
            </div>
          </section>

          {data.imagesUrls.length > 0 && (
            <section className="px-5 mt-5">
              <div className="flex gap-3">
                {data.imagesUrls.slice(0, 4).map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImagebox({ open: true, idx })}
                    className="w-20 h-20 rounded-lg outline-[0.5px] outline-offset-[-0.5px] outline-box-line overflow-hidden bg-white"
                  >
                    <Image
                      src={src}
                      alt={`review-${idx + 1}`}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                      priority
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="px-5 mt-6">
            <div className="inline-flex px-2.5 py-1 rounded-lg bg-primary-200">
              <span className="text-xs font-medium text-text--default">
                좋았던 점
              </span>
            </div>
            <p className="mt-3 text-sm leading-normal text-text--default whitespace-pre-line">
              {data.contentBest}
            </p>
          </section>

          <section className="px-5 mt-6 mb-10">
            <div className="inline-flex px-2.5 py-1 rounded-lg bg-box-line">
              <span className="text-xs font-medium text-text--default">
                아쉬운 점
              </span>
            </div>
            <p className="mt-3 text-sm leading-normal text-text--default whitespace-pre-line">
              {data.contentWorst}
            </p>
          </section>

          {imagebox.open && data.imagesUrls.length ? (
            <Imagebox
              images={data.imagesUrls}
              startIndex={imagebox.idx}
              onClose={() => setImagebox({ open: false, idx: 0 })}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
