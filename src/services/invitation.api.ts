import type { InvitationRequestBody } from '@/types/invitation';
import { tokenStore } from '@/lib/tokenStore';
const BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
import type { InvitationResponse, InvitationData } from '@/types/invitationGet';
export type CreateInvitationResponse = ApiResponse<{ id: number }>;
//청첩장 생성
export async function createInvitation(
  body: InvitationRequestBody,
  options?: { signal?: AbortSignal },
): Promise<CreateInvitationResponse> {
  const token = tokenStore.get();
  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE}/v1/invitation`, {
    method: 'POST',
    headers,
    signal: options?.signal,
    body: JSON.stringify(body),
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to create invitation (${res.status})`);
  }
  return (await res.json()) as CreateInvitationResponse;
}

//청첩장 조회
export async function getInvitation(options?: {
  signal?: AbortSignal;
}): Promise<InvitationResponse> {
  const token = tokenStore.get();
  const headers = new Headers({ Accept: 'application/json' });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE}/v1/invitation`, {
    method: 'GET',
    headers,
    signal: options?.signal,
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to fetch invitation (${res.status})`);
  }

  return (await res.json()) as InvitationResponse;
}
export async function getInvitationData(opts?: {
  signal?: AbortSignal;
}): Promise<InvitationData> {
  const res = await getInvitation(opts); // Promise<InvitationResponse>
  return res.data; // InvitationData
}
export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}
