import type {
  InvitationRequestBody,
  InvitationResponse,
} from '@/types/invitation';

export async function createInvitation(
  body: InvitationRequestBody,
  options?: { signal?: AbortSignal },
): Promise<InvitationResponse> {
  const res = await fetch('/api/vi/invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: options?.signal,
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Failed to create invitation (${res.status})`);
  }
  try {
    return (await res.json()) as InvitationResponse;
  } catch {
    return {} as InvitationResponse;
  }
}
