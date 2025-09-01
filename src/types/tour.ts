export type TourTab = 'dressTour' | 'dressRomance';

export type TourStatus = 'PENDING' | 'DONE'; // 기록 대기 / 완료

export interface DressTourItem {
  id: string;
  brandName: string;
  logoUrl: string;
  status: TourStatus;
}

export interface DressRomanceItem {
  id: string;
  brandName: string;
  logoUrl: string;
  memo?: string;
}

export interface ToursBundle {
  dressTour: DressTourItem[];
  dressRomance: DressRomanceItem[];
}