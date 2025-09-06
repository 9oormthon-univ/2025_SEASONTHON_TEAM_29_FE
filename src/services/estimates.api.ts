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

export async function createEstimate(
  vendorId: number,
  payload: { date: string; time: string },
  signal?: AbortSignal,
) {
  const token = tokenStore.get?.();

  const res = await fetch(`${API_URL}/v1/estimate/${vendorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`견적 담기 실패 (${res.status}) ${text}`);
  }
  return res.json();
}

export type EstimateCartApiItem = {
  estimateId: number;
  estimateDate: string;
  estimateTime: string;
  vendorId: number;
  vendorName: string;
  vendorDescription?: string;
  vendorCategory: string;
  logoImageUrl: string;
  dong: string;
  minimumAmount: number;
  createdAt?: string;
};

export type EstimateCartApiResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    weddingHall?: EstimateCartApiItem[];
    dress?: EstimateCartApiItem[];
    makeUp?: EstimateCartApiItem[];
    studio?: EstimateCartApiItem[];
  } | null;
};

export async function fetchEstimateCart(signal?: AbortSignal) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  if (!API_BASE) throw new Error('NEXT_PUBLIC_API_URL 이 설정되지 않았습니다.');

  const token = tokenStore.get?.();
  const res = await fetch(`${API_BASE}/v1/estimate`, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
    signal,
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`견적서 조회 실패 (HTTP ${res.status}) ${t}`);
  }

  const json = (await res.json()) as EstimateCartApiResponse;
  const d = json.data ?? {};
  const label = {
    weddingHall: '웨딩홀',
    dress: '드레스',
    makeUp: '메이크업',
    studio: '스튜디오',
  } as const;
  type Item = {
    id: number;
    name: string;
    region: string;
    imageSrc: string;
    price: number;
    priceText: string;
    category: '웨딩홀' | '드레스' | '메이크업' | '스튜디오';
  };

  const KR = (n: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(n);

  const mapArr = (
    arr: EstimateCartApiItem[] | undefined,
    cat: Item['category'],
  ): Item[] =>
    (arr ?? []).map((x) => ({
      id:
        x.estimateId ??
        Number(`${x.vendorId}${(x.createdAt ?? '').replace(/\D/g, '') || '0'}`),
      name: x.vendorName,
      region: x.dong ?? '',
      imageSrc: x.logoImageUrl || '/logos/placeholder.png',
      price: Number(x.minimumAmount ?? 0),
      priceText:
        x.minimumAmount != null
          ? `${KR(Number(x.minimumAmount))}~`
          : '가격문의',
      category: cat,
    }));

  const items: Item[] = [
    ...mapArr(d.weddingHall, label.weddingHall),
    ...mapArr(d.dress, label.dress),
    ...mapArr(d.makeUp, label.makeUp),
    ...mapArr(d.studio, label.studio),
  ];

  return items;
}
