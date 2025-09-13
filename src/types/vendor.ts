// src/types/vendor.ts

export type VendorCategory = 'WEDDING_HALL' | 'STUDIO' | 'DRESS' | 'MAKEUP';

/** 공통 페이지 응답 */
export type PageResponse<T> = {
  totalElements: number; totalPages: number; size: number; content: T[];
  number: number; first: boolean; last: boolean; empty: boolean;
};

export type VendorListItem = {
  vendorId: number;
  vendorName: string;
  logoImageUrl?: string;
  regionName?: string;
  averageRating?: number;
  reviewCount?: number;
};

export type VendorProductSummary = {
  id: number; name: string; description?: string; basePrice: number; imageUrls: string[];
};

export type VendorDetail = {
  vendorId: number; vendorName: string; description?: string; phoneNumber?: string;
  vendorType: VendorCategory; fullAddress: string; addressDetail?: string;
  latitude: number; longitude: number; kakaoMapUrl?: string; repMediaUrl?: string;
  products: VendorProductSummary[];
};

export type VendorProductDetail = {
  productId: number; productName: string; basePrice: number; description?: string;
  imageUrls: string[]; vendorId: number; vendorName: string; details: unknown;
};

export type CreateVendorRequest = {
  name: string; phoneNumber: string; description: string; vendorType: VendorCategory; regionCode: number;
  logoImage: { mediaKey: string; contentType: string };
  mainImage: { mediaKey: string; contentType: string };
  fullAddress: string; addressDetail?: string; latitude: number; longitude: number; kakaoMapUrl?: string;
};

/** ------- 상품 생성: 카테고리별 DU ------- */

// 공통 필드
type CreateProductBase = {
  name: string;
  productImages: { mediaKey: string; contentType: string; sortOrder: number }[];
  basePrice: number;
  /** 스웨거 예시들에 공통 존재 */
  durationInMinutes: number;
};

// 확장 가능한 string-literal(새 값 들어와도 컴파일 유지)
type Extensible<T extends string> = T | (string & {});

// 웨딩홀
export type HallStyle = 'HOTEL' | 'CONVENTION' | 'CHAPEL' | 'HOUSE';
export type HallMeal =
  | 'BUFFET' | 'COURSE' | 'ONE_TABLE_SETTING' | 'TABLE_SETTING';

export type CreateWeddingHallProduct = CreateProductBase & {
  vendorType: 'WEDDING_HALL';
  hallStyle: Extensible<HallStyle>;
  hallMeal: Extensible<HallMeal>;
  capacity: number;
  hasParking: boolean;
};

// 스튜디오 (예시 기준)
export type StudioStyle = 'PORTRAIT_FOCUSED' | 'NATURAL_LIGHT' | 'CLASSIC';
export type SpecialShot = 'HANOK' | 'NIGHT' | 'OUTDOOR';

export type CreateStudioProduct = CreateProductBase & {
  vendorType: 'STUDIO';
  studioStyle: Extensible<StudioStyle>;
  specialShot?: Extensible<SpecialShot>;
  iphoneSnap?: boolean;
};

// 드레스 (예시 기준)
export type DressStyle = 'ROMANTIC' | 'MODERN' | 'PRINCESS' | 'MERMAID';
export type DressProduction = 'IMPORTED' | 'DOMESTIC';

export type CreateDressProduct = CreateProductBase & {
  vendorType: 'DRESS';
  dressStyle: Extensible<DressStyle>;
  dressProduction: Extensible<DressProduction>;
};

// 메이크업 (예시 기준)
export type MakeupStyle = 'NATURAL' | 'GLAM' | 'DEWY';

export type CreateMakeupProduct = CreateProductBase & {
  vendorType: 'MAKEUP';
  makeupStyle: Extensible<MakeupStyle>;
  isStylistDesignationAvailable?: boolean;
  hasPrivateRoom?: boolean;
};

export type CreateProductRequest =
  | CreateWeddingHallProduct
  | CreateStudioProduct
  | CreateDressProduct
  | CreateMakeupProduct;

/** API Envelope */
export type ApiEnvelope<T> = { status: number; success: boolean; message?: string; data?: T };