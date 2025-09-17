import type {
  InvitationRequestBody,
  InvitationResponse,
} from '@/types/invitation';
import { tokenStore } from '@/lib/tokenStore';

export async function createInvitation(
  body: InvitationRequestBody,
  options?: { signal?: AbortSignal },
): Promise<InvitationResponse> {
  const token = tokenStore.get();
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  const res = await fetch(`${base}/v1/invitation`, {
    method: 'POST',
    headers,
    signal: options?.signal,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to create invitation (${res.status})`);
  }
  return res.json().catch(() => ({}) as InvitationResponse);
}
