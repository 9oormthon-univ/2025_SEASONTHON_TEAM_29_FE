'use client';

import Header from '@/components/common/monocules/Header';
import CompanyLongCard from '@/components/reviews/CompanyLongCard';
import Imagebox from '@/components/reviews/ImageBox';
import RingRating from '@/components/reviews/RingRating';
import { tokenStore } from '@/lib/tokenStore';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

type ApiResponse<T> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

type CompanyType = '웨딩홀' | '드레스' | '메이크업' | '스튜디오';
const CATEGORY_MAP: Record<
  'WEDDING_HALL' | 'DRESS' | 'MAKEUP' | 'STUDIO',
  CompanyType
> = {
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

const getErrorMessage = (e: unknown) =>
  e instanceof Error
    ? e.message
    : typeof e === 'string'
      ? e
      : '리뷰를 불러오지 못했어요.';

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const [data, setData] = useState<ReviewData | null>(null);
  const [imagebox, setImagebox] = useState<{ open: boolean; idx: number }>({
    open: false,
    idx: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!API_BASE || !id) return;

    const reviewId = Number(id);
    if (!Number.isFinite(reviewId)) {
      setError('잘못된 리뷰 ID 입니다.');
      return;
    }

    const fetchReview = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = tokenStore.get();
        const res = await fetch(
          `${API_BASE}/v1/review/${encodeURIComponent(String(reviewId))}`,
          {
            cache: 'no-store',
            headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as ApiResponse<ReviewData>;
        if (!json?.data) throw new Error('데이터가 없습니다.');
        const d = json.data;
        const normalized: ReviewData = {
          ...d,
          reviewId: Number(d.reviewId),
          vendorId: Number(d.vendorId),
          imagesUrls: Array.isArray(d.imagesUrls)
            ? d.imagesUrls.map(String)
            : [],
          vendorLogoUrl: d.vendorLogoUrl || '/logos/placeholder.png',
        };
        setData(normalized);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchReview();
  }, [API_BASE, id]);

  const categoryKo = useMemo<CompanyType>(() => {
    if (!data) return '웨딩홀';
    return (
      CATEGORY_MAP[data.vendorCategory as keyof typeof CATEGORY_MAP] ?? '웨딩홀'
    );
  }, [data]);
  const router = useRouter();

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Header 
        showBack
        onBack={()=>router.back()}
        value="리뷰상세" />

      {loading && (
        <div className="px-5 mt-5 text-sm text-text--secondary">
          리뷰를 불러오는 중…
        </div>
      )}
      {error && (
        <div className="px-5 mt-5 text-sm text-red-500">오류: {error}</div>
      )}

      {data && !loading && !error && (
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
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-text--default">
                {`${data.writerName} ${data.writerType === 'BRIDE' ? '신부님' : '신랑님'}`}
              </div>
            </div>
          </section>

          <section className="px-5 mt-5">
            <CompanyLongCard
              className="w-full"
              title={data.vendorName}
              logoUrl={data.vendorLogoUrl || '/logos/placeholder.png'}
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
                      unoptimized
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
