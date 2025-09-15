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
  src: string | null;
  href: string;
  alt: string;
  category: string;
  title: string;
  rings: number;
  writer: string;   // ✅ 추가
  date: string;     // ✅ 추가 (YYYY.MM.DD 포맷)
};

function mapToHomeItem(r: RawHomeReview): HomeReviewItem {
  const d = new Date(r.createdAt);
  const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

  return {
    id: r.reviewId,
    src: r.reviewImageUrl ?? null,
    href: `/review/${r.reviewId}`,
    alt: `${r.vendorName} 후기`,
    category: r.vendorName,
    title: r.content?.trim() || `${r.vendorName} 후기`,
    rings: Math.max(0, Math.min(5, Math.round(r.rating))),
    writer: r.writerName,
    date: dateStr,
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

export type ReviewableContract = {
  contractId: number;
  vendorId: number;
  vendorName: string;
  logoImageUrl?: string;
};

export async function fetchMyReviewables(page: number, size: number) {
  const res = await http<ApiEnvelope<Paged<ReviewableContract>>>(
    `/v1/contracts/my/reviewable?page=${page}&size=${size}`,
    { method: 'GET' },
  );
  const raw = res?.data;
  return {
    items: raw?.content ?? [],
    hasNext: raw ? !raw.last : false,
  };
}