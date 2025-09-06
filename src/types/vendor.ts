export type VendorItem = {
  id: number;
  name: string;
  region: string;
  rating: number;
  count: number;
  logo: string;
  href: string;
  price: number;
};

export type PlaceSection = {
  name: string;
  description?: string;
  images: string[];
};

export type VendorAddress = {
  city?: string;
  district?: string;
  dong?: string;
  fullAddress?: string;
  kakaoMapUrl?: string;
};

export type VendorHallDetails = {
  category?: 'WEDDING_HALL';
  style?: 'CONVENTION' | 'CHAPEL' | 'HOTEL' | 'HOUSE';
  meal?: 'BUFFET' | 'COURSE' | 'ONE' | 'TABLE_SETTING';
  hallSeats?: number;
  banquetSeats?: number;
  maximumGuest?: number;
  minimumAmount?: number;
};

export type VendorDetail = {
  id: number;
  title: string;
  category: string;
  description?: string;
  phone?: string;
  mapurl?: string;
  mainImage: string;

  /** UI 한 줄 요약(기존 필드 유지) */
  detail?: string;

  /** 갤러리 섹션(기존) */
  places: PlaceSection[];

  /** ↓ 원본 데이터 모두 저장 */
  address?: VendorAddress;
  details?: VendorHallDetails;
};