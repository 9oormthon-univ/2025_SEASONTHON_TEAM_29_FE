import { http } from '@/services/http';
import { CartDetail } from '@/types/cart';
import type { ApiResponse } from '@/types/reservation';

export async function addCartItem(productId: number, executionDateTime: string) {
  return http<ApiResponse<string>>(`/v1/cart/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, executionDateTime }),
  });
}

/** 활성화 (비활성화는 서버가 자동 처리) */
export async function activateCartItem(cartItemId: number) {
  return http<ApiResponse<string>>(`/v1/cart/items/${cartItemId}/activate`, {
    method: 'PATCH',
  });
}

/** 상세 조회 */
export async function getCartDetail(): Promise<CartDetail> {
  const res = await http<ApiResponse<CartDetail>>(`/v1/cart`, { method: 'GET' });
  return res.data!;
}

export async function removeCartItem(cartItemId: number) {
  return http<ApiResponse<string>>(`/v1/cart/items/${cartItemId}`, {
    method: 'DELETE',
  });
}

/** 활성화 후 최신 견적서 상세를 반환 */
export async function setCartItemActiveAndFetch(cartItemId: number): Promise<CartDetail> {
  await activateCartItem(cartItemId);
  return getCartDetail();
}