// src/types/tour.ts
export type TourTab = 'dressTour' | 'dressRomance';
export type TourStatus = 'WAITING' | 'COMPLETE';
export type Category = 'WEDDING_HALL';

export interface DressTourItem {
  id: number;
  status: TourStatus;
  vendorName: string;
  vendorDescription: string;
  vendorCategory: Category;
  mainImageUrl: string;
  materialOrder?: number;
  neckLineOrder?: number;
  lineOrder?: number;
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