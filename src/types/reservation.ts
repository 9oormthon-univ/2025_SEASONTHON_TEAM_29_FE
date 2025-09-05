export type ApiResponse<T> = {
  status: number;
  success: boolean;
  message?: string;
  data: T;
};
export type VendorItem = {
  id: number;
  name: string;
  logoUrl?: string;
  region?: string;
  category?: 'WEDDING_HALL' | 'DRESS' | 'MAKEUP' | 'STUDIO' | string;
  rating?: { score: number; count?: number };
  priceText?: string;
};
export type ReservationDay = {
  date: string;
  weekdayKo: string;
  available: boolean;
};

export type ReservationTime = {
  time: string;
  available: boolean;
};
