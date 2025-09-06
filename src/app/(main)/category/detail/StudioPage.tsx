'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/Mypage/CompanyCard';
import SvgObject from '@/components/common/atomic/SvgObject';
import Chip from '@/components/common/atomic/Chips';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tokenStore } from '@/lib/tokenStore';

type VendorItem = {
  vendorId: number;
  name: string;
  address?: {
    city?: string;
    district?: string;
  };
  rating?: {
    score: number;
    count?: number;
  };
  minimumAmount?: number;
  logoImageUrl?: string | null;
  mainImageUrl?: string | null;
};

type ApiResp = {
  status: number;
  success: boolean;
  message: string;
  data: {
    vendors: VendorItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  } | null;
};

const PAGE_SIZE = 30;

export default function StudioListPage() {
  const router = useRouter();
  const [selRegion, setSelRegion] = useState(false);
  const [selOutdoor, setSelOutdoor] = useState(false);
  const [selNight, setSelNight] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const endpoint = useMemo(() => {
    return `${API_BASE}/v1/vendor/list/STUDIO?page=${page}&size=${PAGE_SIZE}`;
  }, [API_BASE, page]);

  useEffect(() => {
    if (!API_BASE) return;
    const fetchVendors = async () => {
      setLoading(true);
      setErr(null);
      try {
        const token = tokenStore.get();
        const res = await fetch(endpoint, {
          cache: 'no-store',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResp;
        const list = json.data?.vendors ?? [];
        setItems((prev) => (page === 0 ? list : [...prev, ...list]));
        const totalPages = json.data?.totalPages ?? 0;
        setHasMore(page + 1 < totalPages);
      } catch (e) {
        setErr(e instanceof Error ? e.message : '업체 조회 실패');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [API_BASE, endpoint, page]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    setPage((p) => p + 1);
  };

  const toPriceText = (won?: number) =>
    typeof won === 'number' ? `${Math.round(won / 10000)}만원~` : '가격문의';

  return (
    <main className="relative mx-auto w-full max-w-[420px]">
      <Header
        value="스튜디오"
        rightSlot={
          <button type="button" aria-label="검색" className="p-2">
            <Search className="h-5 w-5 text-gray-500" />
          </button>
        }
      />
      <section className="px-5 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Chip
              size="sm"
              selected={selRegion}
              onClick={() => setSelRegion((v) => !v)}
            >
              지역
            </Chip>
            <Chip
              size="sm"
              selected={selOutdoor}
              onClick={() => setSelOutdoor((v) => !v)}
            >
              야외촬영
            </Chip>
            <Chip
              size="sm"
              selected={selNight}
              onClick={() => setSelNight((v) => !v)}
            >
              야간촬영
            </Chip>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-text-secondary"
          >
            <SvgObject
              src="/icons/upDown.svg"
              alt="정렬"
              width={14}
              height={14}
            />
            <span>추천순</span>
          </button>
        </div>
      </section>

      <section className="px-5 pt-4 pb-20">
        <div className="grid grid-cols-3 gap-x-3 gap-y-6">
          {items.map((s) => {
            const imageSrc =
              s.mainImageUrl || s.logoImageUrl || '/logos/placeholder.png';
            const region =
              s.address?.district ?? s.address?.city ?? '지역정보 없음';
            const rating = s.rating ?? { score: 0, count: 0 };

            return (
              <CompanyCard
                key={s.vendorId}
                variant="category"
                name={s.name}
                region={region}
                imageSrc={imageSrc}
                rating={rating}
                priceText={toPriceText(s.minimumAmount)}
                alt={`${region} ${s.name}`}
                onClick={() =>
                  router.push(
                    `/reservation/company/months?step=2&vendorId=${s.vendorId}`,
                  )
                }
              />
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center">
          {hasMore ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="px-4 h-10 rounded-full text-sm font-medium outline-1 outline-box-line disabled:opacity-50"
            >
              {loading ? '불러오는 중…' : '더 보기'}
            </button>
          ) : (
            <p className="text-sm text-text-secondary">마지막 페이지예요</p>
          )}
        </div>
      </section>

      <div className="pb-[env(safe-area-inset-bottom)]" />
    </main>
  );
}
