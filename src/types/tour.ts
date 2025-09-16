export type TourTab = 'dressTour' | 'dressRomance';
export type TourStatus = 'WAITING' | 'COMPLETE';
export type Category = 'WEDDING_HALL';

/** 앱에서 쓰는 목록 아이템 (드레스 투어) */
export interface DressTourItem {
  id: number;
  status: TourStatus;
  vendorName: string;
  vendorDescription?: string;
  vendorCategory?: Category;
  logoImageUrl?: string;
  owned?: boolean;

  materialOrder?: number;
  neckLineOrder?: number;
  lineOrder?: number;
}

export interface TourRomanceItem {
  id: number;
  title: string;
  status: TourStatus;
  createdAt: string;
  owned: boolean;

  materialOrder?: number;
  neckLineOrder?: number;
  lineOrder?: number;
}

/** 전체 번들 */
export interface ToursBundle {
  dressTour: DressTourItem[];
  dressRomance: TourRomanceItem[];
}