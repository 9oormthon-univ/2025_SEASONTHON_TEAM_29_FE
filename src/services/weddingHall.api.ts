// src/services/weddingHall.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { SearchItem } from '@/types/search';

export type HallStyle = 'CHAPEL' | 'HOTEL' | 'CONVENTION' | 'HOUSE';
export type HallMeal  = 'BUFFET' | 'COURSE' | 'ONE_TABLE_SETTING' | 'TABLE_SETTING';

export type HallSearchReq = {
  districts?: string[];          // ["강남구", "마포구"]
  maxPrice?: number;             // 최대 금액(원)
  styles?: HallStyle[];          // 다중 선택
  meals?: HallMeal[];            // 다중 선택
  requiredGuests?: number;       // 최소 하객 수
  page?: number;
  size?: number;
};

type HallSearchRes = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Array<{
    vendorId: number;
    name: string;
    category: 'WEDDING_HALL';
    dong: string;
    logoImageUrl?: string;
    totalReviewCount: number;
    averageRating: number;
    price: number;               // 정렬 기준 가격
  }>;
  number: number;
};

export async function searchWeddingHalls(
  body: HallSearchReq,
  opts?: { skipAuth?: boolean }
): Promise<{
  items: SearchItem[];
  pageSize: number;
  totalElements: number;
  totalPages: number;
}> {
  const page = body.page ?? 0;
  const size = body.size ?? 12;

  const res = await http<ApiEnvelope<HallSearchRes>>(
    `/v1/vendor/search/wedding-halls?page=${page}&size=${size}`,
    {
      method: 'POST',
      body: JSON.stringify({
        districts: body.districts,
        maxPrice: body.maxPrice,
        styles: body.styles,
        meals: body.meals,
        requiredGuests: body.requiredGuests,
      }),
      skipAuth: opts?.skipAuth,
    }
  );

  const data = res.data ?? { totalElements: 0, totalPages: 0, size, content: [], number: page };

  const items: SearchItem[] = data.content.map((it) => ({
    id: it.vendorId,
    name: it.name,
    region: it.dong ?? '',
    cat: 'hall',
    price: it.price,
    logo: it.logoImageUrl,
    rating: it.averageRating,
    count: it.totalReviewCount,
    // 필요하면 tags에 한글 라벨 넣기
  }));

  return {
    items,
    pageSize: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
  };
}