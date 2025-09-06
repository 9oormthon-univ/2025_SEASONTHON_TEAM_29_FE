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