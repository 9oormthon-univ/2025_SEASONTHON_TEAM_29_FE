'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/common/monocules/Header';
import CompanyLongCard from '@/components/reviews/CompanyLongCard';
import RingRating from '@/components/reviews/RingRating';
import { tokenStore } from '@/lib/tokenStore';

type ApiResp = {
  status: number;
  success: boolean;
  message: string;
  data: {
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
};

const CATEGORY_KO: Record<
  string,
  '웨딩홀' | '드레스' | '메이크업' | '스튜디오' | '기타'
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

export default function ReviewDetailPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<ApiResp['data'] | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const token = tokenStore.get();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_URL}/v1/review/12`, {
          method: 'GET',
          headers,
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ApiResp = await res.json();
        if (!json?.success) throw new Error(json?.message || 'API error');
        if (alive) setData(json.data);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? '오류가 발생했어요.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [API_URL]);

  const categoryKo = useMemo(
    () => (data ? (CATEGORY_KO[data.vendorCategory] ?? '기타') : ''),
    [data],
  );

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Header value="리뷰상세" />

      {loading && <div className="p-5">불러오는 중...</div>}
      {err && <div className="p-5 text-red-500">에러: {err}</div>}

      {data && (
        <>
          {data.weddingDday && (
            <div className="px-5 pt-3">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-primary-100">
                <span className="text-primary-500 text-xs font-medium opacity-80">
                  {data.weddingDday}
                </span>
              </div>
            </div>
          )}
          <section className="px-5 mt-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/pinkProfile.svg"
                alt="profile"
                width={40}
                height={40}
                className="object-contain"
                priority
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
              logoUrl={data.vendorLogoUrl}
              date={fmtDate(data.createdAt)}
              type={categoryKo as any}
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
          {data.imagesUrls?.length > 0 && (
            <section className="px-5 mt-5">
              <div className="flex gap-3">
                {data.imagesUrls.slice(0, 4).map((src, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-lg outline-[0.5px] outline-offset-[-0.5px] outline-box-line overflow-hidden bg-white"
                  >
                    <img
                      src={src}
                      alt={`review-${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="px-5 mt-6">
            <div className="inline-flex px-2.5 py-1 rounded-lg bg-primary-100">
              <span className="text-xs font-medium text-text--default">
                좋았던 점
              </span>
            </div>
            <p className="mt-3 text-sm leading-normal text-text--default whitespace-pre-line">
              {data.contentBest}
            </p>
          </section>

          <section className="px-5 mt-6 mb-10">
            <div className="inline-flex px-2.5 py-1 rounded-lg bg-box-line/40">
              <span className="text-xs font-medium text-text--default">
                아쉬운 점
              </span>
            </div>
            <p className="mt-3 text-sm leading-normal text-text--default whitespace-pre-line">
              {data.contentWorst}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
