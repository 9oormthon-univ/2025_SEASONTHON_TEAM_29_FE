import { http, type ApiEnvelope } from '@/services/http';

export type CreateReviewPayload = {
  vendorId: number;
  rating: number;           // 1~5
  contentBest: string;      // MAX_LEN 이하
  contentWorst: string;     // MAX_LEN 이하
  imageKeys: string[];      // S3 key 배열 (최대 MAX_PHOTOS)
};

export async function createReview(payload: CreateReviewPayload) {
  // http()가 /api prefix + Authorization 헤더 + 401 재발급까지 처리
  return http<ApiEnvelope<unknown>>('/v1/review/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export type RawHomeReview = {
  reviewId: number;
  vendorName: string;
  reviewImageUrl: string | null;
  content: string;
  rating: number; // 1~5
  writerName: string;
  createdAt: string;
};

type Paged<T> = {
  content: T[];
  totalPages: number;
  number: number;
  last: boolean;
  size: number;
  first: boolean;
  empty: boolean;
};

export type HomeReviewItem = {
  id: number;
  src: string | null;          // 이미지 없으면 null
  href: string;                // 상세 링크
  alt: string;                 // 이미지 대체 텍스트
  category: string;            // 여기서는 업체명으로 표시
  title: string;               // 리뷰 본문 요약
  rings: number;               // 평점
};

function mapToHomeItem(r: RawHomeReview): HomeReviewItem {
  return {
    id: r.reviewId,
    src: r.reviewImageUrl ?? null,
    href: `/review/${r.reviewId}`,
    alt: `${r.vendorName} 후기`,
    category: r.vendorName,
    title: r.content?.trim() || `${r.vendorName} 후기`,
    rings: Math.max(0, Math.min(5, Math.round(r.rating))),
  };
}

export async function getHomeReviews(page: number, size: number) {
  const res = await http<ApiEnvelope<Paged<RawHomeReview>>>(
    `/v1/review/all-reviews?page=${page}&size=${size}`,
    { method: 'GET' }
  );
  const raw = res?.data;
  const items = (raw?.content ?? []).map(mapToHomeItem);
  const hasNext = raw ? !raw.last : false;
  return { items, hasNext };
}