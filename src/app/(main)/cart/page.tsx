'use client';

import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/my/CompanyCard';
import { getCartDetail, removeCartItem } from '@/services/cart.api';
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

export default function EstimateCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedByType, setSelectedByType] = useState<
    Partial<Record<CartItem['vendorType'], number>>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data: CartDetail = await getCartDetail();
        const all: CartItem[] = [
          ...data.weddingHalls,
          ...data.dresses,
          ...data.makeups,
          ...data.studios,
        ];
        setItems(all);
      } catch (e) {
        setError(e instanceof Error ? e.message : '견적서 조회 실패');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleOne = (item: CartItem) => {
    setSelectedByType((prev) => {
      const current = prev[item.vendorType];
      if (current === item.cartItemId) {
        const next = { ...prev };
        delete next[item.vendorType];
        return next;
      }
      return { ...prev, [item.vendorType]: item.cartItemId };
    });
  };

  const total = useMemo(() => {
    const selectedItems = items.filter(
      (i) => selectedByType[i.vendorType] === i.cartItemId
    );
    return selectedItems.reduce((s, i) => s + i.price, 0);
  }, [items, selectedByType]);

  const groups: Record<string, CartItem[]> = {
    웨딩홀: items.filter((i) => i.vendorType === 'WEDDING_HALL'),
    드레스: items.filter((i) => i.vendorType === 'DRESS'),
    메이크업: items.filter((i) => i.vendorType === 'MAKEUP'),
    스튜디오: items.filter((i) => i.vendorType === 'STUDIO'),
  };

  const router = useRouter();

  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedIds.map((id) => removeCartItem(id)));
      setItems((prev) => prev.filter((i) => !selectedIds.includes(i.cartItemId)));
      setSelectedIds([]);
      setSelecting(false);
    } catch (e) {
      console.log(e);
      alert('삭제 실패');
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
              setSelectedIds([]); // 선택 모드 토글 시 초기화
            }}
            className="text-sm font-medium text-primary-500"
          >
            {selecting ? '취소' : '선택'}
          </button>
        }
      />

      <section className="px-5 mt-3">
        <div className="w-full h-20 inline-flex flex-col items-center justify-center rounded-2xl border border-zinc-300/50 bg-white px-7">
          <div className="text-text--default text-sm font-medium">총 금액</div>
          <div className="mt-1 text-xl font-medium text-[var(--color-primary-500)]">
            {total === 0 ? '0원' : KR(total)}
          </div>
        </div>
      </section>

      {loading && (
        <p className="px-5 mt-4 text-sm text-text--secondary">
          견적서를 불러오는 중…
        </p>
      )}
      {error && (
        <p className="px-5 mt-4 text-sm text-red-500">{error}</p>
      )}

      <section className="px-5 mt-6">
        {Object.entries(groups).map(([label, group]) => (
          <div key={label} className="mb-8">
            <h3 className="mb-3 text-base font-semibold text-text--default">
              {label}
            </h3>
            <div className="relative -mx-5 overflow-hidden">
              <div
                className="no-scrollbar overflow-x-auto"
                style={{ scrollPaddingLeft: 20, scrollPaddingRight: 20 }}
              >
                <div className="flex gap-[10px] px-5 py-1 snap-x snap-mandatory">
                  {group.length === 0 ? (
                    <div className="text-sm text-text--secondary py-4">
                      담긴 항목이 없어요
                    </div>
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
                        selected={selectedIds.includes(item.cartItemId)}
                        onClick={
                          selecting
                            ? () => toggleSelect(item.cartItemId)
                            : () => toggleOne(item)
                        }
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