export type VendorCategory = 'WEDDING_HALL' | 'STUDIO' | 'DRESS' | 'MAKEUP';

export type PageResponse<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type VendorListItem = {
  vendorId: number;
  vendorName: string;
  logoImageUrl?: string;
  regionName?: string;
  averageRating?: number;
  reviewCount?: number;
  minPrice?: number;
};

export type VendorItem = {
  id: number;
  name: string;
  region: string;
  rating: number;
  count: number;
  price: number;
  logo: string;
  href: string;
};

export type VendorProductSummary = {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  imageUrls: string[];
};

export type VendorDetail = {
  vendorId: number;
  vendorName: string;
  description?: string;
  phoneNumber?: string;
  vendorType: VendorCategory;
  fullAddress: string;
  addressDetail?: string;
  latitude: number;
  longitude: number;
  kakaoMapUrl?: string;
  repMediaUrl?: string;
  products: VendorProductSummary[];
};

export type VendorProductDetail = {
  productId: number;
  productName: string;
  basePrice: number;
  description?: string;
  imageUrls: string[];
  vendorId: number;
  vendorName: string;
  details: unknown;
};

export type CreateVendorRequest = {
  name: string;
  phoneNumber: string;
  description: string;
  vendorType: VendorCategory;
  regionCode: number;
  logoImage: { mediaKey: string; contentType: string };
  mainImage: { mediaKey: string; contentType: string };
  fullAddress: string;
  addressDetail?: string;
  latitude: number;
  longitude: number;
  kakaoMapUrl?: string;
};

/** ---------- 공통 ---------- */
type CreateProductBase = {
  name: string;
  description: string;
  productImages: { mediaKey: string; contentType: string; sortOrder: number }[];
  basePrice: number;
  durationInMinutes: number;
};

export type Extensible<T extends string> = T | (string & {});

/** ---------- 웨딩홀 ---------- */
export type HallStyle = 'HOTEL' | 'CONVENTION' | 'HOUSE';
export type HallMeal = 'BUFFET' | 'COURSE' | 'SEMI_COURSE';

export type CreateWeddingHallProduct = CreateProductBase & {
  vendorType: 'WEDDING_HALL';
  hallStyle: Extensible<HallStyle>;
  hallMeal: Extensible<HallMeal>;
  capacity: number;
  hasParking: boolean;
};

/** ---------- 스튜디오 ---------- */
export type StudioStyle = 'PORTRAIT_FOCUSED' | 'NATURAL' | 'EMOTIONAL' | 'CLASSIC' | 'BLACK_AND_WHITE';
export type SpecialShot = 'HANOK' | 'UNDERWATER' | 'WITH_PET';

export type CreateStudioProduct = CreateProductBase & {
  vendorType: 'STUDIO';
  studioStyle: Extensible<StudioStyle>;
  specialShot?: Extensible<SpecialShot>;
  iphoneSnap?: boolean;
};

/** ---------- 드레스 ---------- */
export type DressStyle = 'MODERN' | 'CLASSIC' | 'ROMANTIC' | 'DANAH' | 'UNIQUE' | 'HIGH_END';
export type DressOrigin = 'DOMESTIC' | 'IMPORTED';

export type CreateDressProduct = CreateProductBase & {
  vendorType: 'DRESS';
  dressStyle: Extensible<DressStyle>;
  dressOrigin: Extensible<DressOrigin>;
};

/** ---------- 메이크업 ---------- */
export type MakeupStyle = 'INNOCENT' | 'ROMANTIC' | 'NATURAL' | 'GLAM';

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

export type ApiEnvelope<T> = {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
};