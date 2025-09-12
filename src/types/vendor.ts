// 공통
export type VendorCategory = 'WEDDING_HALL' | 'STUDIO' | 'DRESS' | 'MAKEUP';

/** 스프링 페이지 응답 표준 */
export type PageResponse<T> = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number; // 현재 페이지(0-based)
  first: boolean;
  last: boolean;
  empty: boolean;
};

/** 목록 아이템 (배너/카테고리 리스트 공용) */
export type VendorListItem = {
  vendorId: number;
  vendorName: string;
  logoImageUrl?: string;
  regionName?: string;
  averageRating?: number;
  reviewCount?: number;
};

/** 업체 상세에 들어있는 상품 요약 */
export type VendorProductSummary = {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  imageUrls: string[];
};

/** 업체 상세 */
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

/** 상품 상세 (details는 타입별 상이 → unknown으로 엄격히 보존) */
export type VendorProductDetail = {
  productId: number;
  productName: string;
  basePrice: number;
  description?: string;
  imageUrls: string[];
  vendorId: number;
  vendorName: string;
  details: unknown; // UI 측에서 카테고리별로 좁혀서 사용
};

/** 신규 업체 생성 Request */
export type CreateVendorRequest = {
  name: string;
  vendorType: VendorCategory;
  regionId: number;
  logoImage: { mediaKey: string; contentType: string };
  mainImage: { mediaKey: string; contentType: string };
  fullAddress: string;
  addressDetail?: string;
  latitude: number;
  longitude: number;
  kakaoMapUrl?: string;
};

/** 신규 상품 생성 Request – 카테고리별 Discriminated Union */
// 공통 필드
type CreateProductBase = {
  name: string;
  productImages: { mediaKey: string; contentType: string; sortOrder: number }[];
  basePrice: number;
};

// 웨딩홀 전용 상세 (Swagger 예시 기준)
export type HallStyle = 'HOTEL' | 'CONVENTION' | 'CHAPEL' | 'HOUSE';
export type HallMeal =
  | 'BUFFET'
  | 'COURSE'
  | 'ONE_TABLE_SETTING'
  | 'TABLE_SETTING';

export type CreateWeddingHallProduct = CreateProductBase & {
  vendorType: 'WEDDING_HALL';
  hallStyle: HallStyle;
  hallMeal: HallMeal;
  capacity: number;
  hasParking: boolean;
};

// 아직 스펙 미정 도메인은 스텁 형태(명시적으로 확장 지점 마련)
export type CreateStudioProduct = CreateProductBase & {
  vendorType: 'STUDIO';
  // TODO: 스웨거 확정되면 필드 추가
};
export type CreateDressProduct = CreateProductBase & {
  vendorType: 'DRESS';
  // TODO
};
export type CreateMakeupProduct = CreateProductBase & {
  vendorType: 'MAKEUP';
  // TODO
};

export type CreateProductRequest =
  | CreateWeddingHallProduct
  | CreateStudioProduct
  | CreateDressProduct
  | CreateMakeupProduct;

/** API Envelope (서버 공통 래퍼) */
export type ApiEnvelope<T> = {
  status: number;
  success: boolean;
  message?: string;
  data?: T;
};