// src/types/mypage.ts
export type MyProfile = {
  name?: string;
  type?: 'BRIDE' | 'GROOM';
  weddingDay?: number | string; // D-offset or YYYY-MM-DD
  partnerName?: string;
  coupled?: boolean;
};

export type MyReservation = {
  id: number;
  vendorId: number;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm or ''
  createdAt: string;
  updatedAt: string;
  vendorName?: string;
  vendorLogoUrl?: string;
  mainImageUrl?: string;
  vendorDescription?: string;
  vendorCategory?: string;
  district?: string;
};

export type ReservationApiItem = {
  id: number | string;
  vendorId: number | string;
  reservationDate: string;
  reservationTime?: string;
  createdAt?: string;
  updatedAt?: string;
  vendorName?: string;
  vendorLogoUrl?: string;
  mainImageUrl?: string;
  vendorDescription?: string;
  vendorCategory?: string;
  district?: string;
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

export type ReviewCompany = {
  id: string;
  name: string;
  imageSrc: string;
  district: string;
  rating: { score: number; count?: number };
};