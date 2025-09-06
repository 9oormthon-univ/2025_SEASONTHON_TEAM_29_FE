import { tokenStore } from '@/lib/tokenStore';
import { ContractAvailabilityReq, ContractSlot } from '@/types/estimate';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
function toKSTIso(date: string, time: string) {
  return `${date}T${time}+09:00`;
}

export async function fetchContractSlots(
  vendorId: number,
  body: ContractAvailabilityReq,
  signal?: AbortSignal,
): Promise<{ items: ContractSlot[]; page: number; totalPages: number }> {
  const token = tokenStore.get?.();
  const res = await fetch(`${API_URL}/v1/contracts/${vendorId}/contract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      ...body,
      availableOnly: body.availableOnly ?? true,
    }),
    cache: 'no-store',
    signal,
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`가용 시간 조회 실패 (${res.status}) ${t}`);
  }
  const json = await res.json();
  const arr = (json?.data?.timeSlots ?? []) as Array<{
    date: string;
    time: string;
    minimumAmount: number;
    expectedGuests: number;
    expectedMealCost: number;
  }>;

  const items: ContractSlot[] = arr.map((s) => ({
    id: `${s.date} ${s.time}`,
    dateISO: toKSTIso(s.date, s.time),
    hallFee: Number(s.minimumAmount ?? 0),
    minGuests: Number(s.expectedGuests ?? 0),
    mealFee: Number(s.expectedMealCost ?? 0),
  }));

  const page = Number(json?.data?.pagination?.currentPage ?? 1);
  const totalPages = Number(json?.data?.pagination?.totalPages ?? 1);

  return { items, page, totalPages };
}
