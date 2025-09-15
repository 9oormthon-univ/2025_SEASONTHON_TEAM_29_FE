// src/types/tour.ts
export type TourTab = 'dressTour' | 'dressRomance';
export type TourStatus = 'WAITING' | 'COMPLETE';
export type Category = 'WEDDING_HALL';

/** 앱에서 쓰는 목록 아이템 */
export interface DressTourItem {
  id: number;
  status: TourStatus;
  vendorName: string;
  vendorDescription?: string;
  vendorCategory?: Category;
  logoImageUrl?: string;
  owned?: boolean;

  // 드레스 기록 (있을 때만)
  materialOrder?: number;
  neckLineOrder?: number;
  lineOrder?: number;
}

/** 컴포넌트 호환용 번들 (로망은 아직 미사용) */
export interface ToursBundle {
  dressTour: DressTourItem[];
  dressRomance: never[];
}

/** ===== 서버 스키마(스웨거) ===== */
export interface TourListItemApi {
  tourId: number;
  vendorName: string;
  vendorLogoUrl: string;
  status: TourStatus;
  owned: boolean;
}

export interface PageApi<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
  sort?: { empty: boolean; sorted: boolean; unsorted: boolean };
  pageable?: {
    offset: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
}

export interface TourDetailApi {
  tourId: number;
  vendorName: string;
  vendorLogoUrl: string;
  status: TourStatus;
  owned: boolean;
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
}

export interface UpdateDressReq {
  materialOrder: number;
  neckLineOrder: number;
  lineOrder: number;
}