'use client';

import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/my/CompanyCard';
import {
  getCartDetail,
  removeCartItem,
  setCartItemActiveAndFetch,
} from '@/services/cart.api';
import type { CartDetail, CartItem } from '@/types/cart';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Category = '스튜디오' | '웨딩홀' | '드레스' | '메이크업';
const vendorTypeToCategory: Record<CartItem['vendorType'], Category> = {
  WEDDING_HALL: '웨딩홀',
  DRESS: '드레스',
  MAKEUP: '메이크업',
  STUDIO: '스튜디오',
};

const KR = (n: number) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(n);

function flatten(detail: CartDetail): CartItem[] {
  return [
    ...detail.weddingHalls,
    ...detail.dresses,
    ...detail.makeups,
    ...detail.studios,
  ];
}

export default function EstimateCartPage() {
  const router = useRouter();

  const [detail, setDetail] = useState<CartDetail | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [patchingId, setPatchingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const refresh = async () => {
    const d = await getCartDetail();
    setDetail(d);
    setItems(flatten(d));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : '견적서 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groups: Record<string, CartItem[]> = {
    웨딩홀: items.filter((i) => i.vendorType === 'WEDDING_HALL'),
    드레스: items.filter((i) => i.vendorType === 'DRESS'),
    메이크업: items.filter((i) => i.vendorType === 'MAKEUP'),
    스튜디오: items.filter((i) => i.vendorType === 'STUDIO'),
  };

  const total = useMemo(() => detail?.totalActivePrice ?? 0, [detail?.totalActivePrice]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedIds.map((id) => removeCartItem(id)));
      await refresh();
      setSelectedIds([]);
      setSelecting(false);
    } catch {
      alert('삭제 실패');
    }
  };

  const onCardClick = async (item: CartItem) => {
    if (selecting) {
      toggleSelect(item.cartItemId);
      return;
    }
    if (patchingId) return;
  
    try {
      setPatchingId(item.cartItemId);
      const d = await setCartItemActiveAndFetch(item.cartItemId);
      setDetail(d);
      setItems(flatten(d));
    } catch (e) {
      setError(e instanceof Error ? e.message : '상태 변경 실패');
    } finally {
      setPatchingId(null);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <Header
        showBack
        onBack={() => router.push('/home')}
        value="견적서"
        rightSlot={
          <button
            onClick={() => {
              setSelecting((prev) => !prev);
              setSelectedIds([]);
            }}
            className="text-sm font-medium text-primary-500"
          >
            {selecting ? '취소' : '선택삭제'}
          </button>
        }
      />

      <section className="px-5 mt-3">
        <div className="w-full h-20 inline-flex flex-col items-center justify-center rounded-2xl border border-zinc-300/50 bg-white px-7">
          <div className="text-text--default text-sm font-medium">총 금액</div>
          <div className="mt-1 text-xl font-medium text-[var(--color-primary-500)]">
            {KR(total)}
          </div>
        </div>
      </section>

      {loading && <p className="px-5 mt-4 text-sm text-text--secondary">견적서를 불러오는 중…</p>}
      {error && <p className="px-5 mt-4 text-sm text-red-500">{error}</p>}

      <section className="px-5 mt-6">
        {Object.entries(groups).map(([label, group]) => (
          <div key={label} className="mb-8">
            <h3 className="mb-3 text-base font-semibold text-text--default">{label}</h3>
            <div className="relative -mx-5 overflow-hidden">
              <div className="no-scrollbar overflow-x-auto">
                <div className="flex gap-[12px] px-5 py-1 snap-x snap-mandatory">
                  {group.length === 0 ? (
                    <div className="text-sm text-text--secondary py-4">담긴 항목이 없어요</div>
                  ) : (
                    group.map((item) => (
                      <CompanyCard
                        key={item.cartItemId}
                        variant="cart"
                        name={item.vendorName}
                        region={item.regionName}
                        imageSrc={item.logoImageUrl}
                        priceText={`${Math.floor(item.price / 10000)}만원`}
                        executionDateTime={item.executionDateTime}
                        productName={item.productName}
                        category={vendorTypeToCategory[item.vendorType]}
                        selecting={selecting}
                        selected={selecting ? selectedIds.includes(item.cartItemId) : item.isActive}
                        onClick={() => onCardClick(item)}
                        disabled={patchingId === item.cartItemId}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {selecting && selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto p-4 bg-white border-t border-gray-200">
          <button
            onClick={deleteSelected}
            className="w-full h-12 bg-red-500 text-white font-semibold rounded-lg"
          >
            선택 항목 삭제
          </button>
        </div>
      )}

      <div className="h-20" />
    </div>
  );
}