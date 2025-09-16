// src/services/vendor-review.api.ts
import { http, type ApiEnvelope } from '@/services/http';

export type RatingDist = Record<'1' | '2' | '3' | '4' | '5', number>;

// 서버 원본 응답 타입
export type VendorReviewStatsResponse = {
  totalReviewCount?: number;
  totalCount?: number;
  averageRating?: number;
  ratingCounts?: Partial<RatingDist>;
  ratingDistribution?: Partial<RatingDist>;
};

export type VendorReviewStatsType = {
  totalCount: number;
  averageRating: number;
  ratingDistribution: RatingDist; // 항상 1~5 키 보장
};

export async function getVendorReviewStats(
  vendorId: number,
): Promise<VendorReviewStatsType> {
  const res = await http<ApiEnvelope<VendorReviewStatsResponse>>(
    `/v1/review/${vendorId}/stats`,
    { method: 'GET' },
  );
  const d = res.data ?? {};

  const counts = d.ratingCounts ?? d.ratingDistribution ?? {};
  const dist: RatingDist = {
    '1': Number(counts['1'] ?? 0),
    '2': Number(counts['2'] ?? 0),
    '3': Number(counts['3'] ?? 0),
    '4': Number(counts['4'] ?? 0),
    '5': Number(counts['5'] ?? 0),
  };

  return {
    totalCount: Number(d.totalReviewCount ?? d.totalCount ?? 0),
    averageRating: Number(d.averageRating ?? 0),
    ratingDistribution: dist,
  };
}

// 리뷰 상세 타입
export type RawVendorReview = {
  reviewId: number;
  writerName: string;
  rating: number;
  // 서버가 content 또는 contentBest/contentWorst로 내려올 수 있음
  content?: string;
  contentBest?: string;
  contentWorst?: string;
  createdAt: string; // ISO
  imageUrls?: string[]; // 썸네일/원본 URL들
};

export type VendorReviewsPage = {
  reviews: RawVendorReview[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

export type ReviewSort = 'createdAt,desc' | 'rating,desc' | 'rating,asc';

export async function getVendorReviews(
  vendorId: number,
  page = 0,
  size = 10,
  sort: ReviewSort = 'createdAt,desc',
): Promise<VendorReviewsPage> {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort, // Spring Pageable: "field,direction"
  });
  const res = await http<ApiEnvelope<VendorReviewsPage>>(
    `/v1/review/${vendorId}/reviews?${qs.toString()}`,
    { method: 'GET' },
  );
  return res.data!;
}