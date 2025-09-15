// services/cart.api.ts
import { http } from '@/services/http';
import { CartDetail } from '@/types/cart';
import type { ApiResponse } from '@/types/reservation';

export async function addCartItem(productId: number, executionDateTime: string) {
  return http<ApiResponse<string>>(`/v1/cart/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, executionDateTime }),
  });
}

export async function activateCartItem(cartItemId: number) {
  return http<ApiResponse<string>>(`/v1/cart/items/${cartItemId}/activate`, {
    method: 'PATCH',
  });
}

export async function getCartDetail(): Promise<CartDetail> {
  const res = await http<ApiResponse<CartDetail>>(`/v1/cart`, { method: 'GET' });
  return res.data!;
}

export async function removeCartItem(cartItemId: number) {
  return http<ApiResponse<string>>(`/v1/cart/items/${cartItemId}`, {
    method: 'DELETE',
  });
}