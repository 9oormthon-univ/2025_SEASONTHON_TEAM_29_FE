// src/types/cart.ts
export type CartItem = {
  cartItemId: number;
  productId: number;
  vendorId: number;
  vendorType: 'WEDDING_HALL' | 'DRESS' | 'MAKEUP' | 'STUDIO';
  vendorName: string;
  regionName: string;
  logoImageUrl: string;
  productName: string;
  price: number;
  executionDateTime: string; // ISO8601
  isActive: boolean;
};

export type CartDetail = {
  totalActivePrice: number;
  weddingHalls: CartItem[];
  dresses: CartItem[];
  makeups: CartItem[];
  studios: CartItem[];
};