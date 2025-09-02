// src/services/weddingHall.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type { SearchItem } from '@/types/search';

export type HallStyle = 'CHAPEL' | 'HOTEL' | 'CONVENTION' | 'HOUSE';
export type HallMeal  = 'BUFFET' | 'COURSE' | 'ONE' | 'TABLE_SETTING';

export type HallSearchReq = {
  style?: HallStyle;
  meal?: HallMeal;
  minGuestCount?: number;
  minPrice?: number;   // 원
  page?: number;
  size?: number;
};

type HallSearchRes = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Array<{
    id: number;
    name: string;
    category: 'WEDDING_HALL';
    style: HallStyle;
    meal: HallMeal;
    description: string;
    minimumAmount: number;
    maximumGuest: number;
    vendorImageResponses: Array<{
      id: number;
      imageUrl: string;
      vendorImageType: 'WEDDING_HALL_MAIN' | string;
      sortOrder: number;
    }>;
  }>;
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
  const res = await http<ApiEnvelope<HallSearchRes>>(
    '/v1/vendor/wedding_hall/search',
    { method: 'POST', body: JSON.stringify(body), skipAuth: opts?.skipAuth }
  );

  const data = res.data ?? { totalElements: 0, totalPages: 0, size: 0, content: [] };

  const items: SearchItem[] = data.content.map(it => {
    const main =
      it.vendorImageResponses?.find(v => v.vendorImageType === 'WEDDING_HALL_MAIN')
      ?? it.vendorImageResponses?.[0];

    return {
      id: it.id,
      name: it.name,
      region: '',
      cat: 'hall',
      price: it.minimumAmount,
      logo: main?.imageUrl,
      tags: [it.style, it.meal].filter(Boolean),
    };
  });

  return {
    items,
    pageSize: data.size,
    totalElements: data.totalElements,
    totalPages: data.totalPages,
  };
}