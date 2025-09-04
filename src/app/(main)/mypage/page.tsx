'use client';

import BottomNav from '@/components/common/atomic/BottomNav';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/Mypage/CompanyCard';
import DdayCard from '@/components/Mypage/D-dayCheck';
import CompanyModal from './CompanyModal';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Company = { id: string; region: string; name: string; imageSrc: string };
type ReviewCompany = Company & { rating: { score: number; count?: number } };

const RESERVE_0830: Company[] = [
  {
    id: '1',
    region: '선릉',
    name: '그레이스케일',
    imageSrc: '/logos/grayscale.png',
  },
  { id: '2', region: '서초', name: '제니하우스', imageSrc: '/logos/jh.png' },
  { id: '3', region: '청담', name: 'ST정우', imageSrc: '/logos/stj.png' },
];

type VendorItem = { id: number | string; name: string; region?: string };
type VendorApiItem = Partial<{
  id: number | string;
  vendorId: number | string;
  weddingHallId: number | string;
  name: string;
  hallName: string;
  vendorName: string;
  region: string;
  area: string;
  location: string;
}>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function pickList(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (isRecord(json) && Array.isArray(json.data)) return json.data as unknown[];
  if (isRecord(json) && Array.isArray(json.content))
    return json.content as unknown[];
  return [];
}

function toVendorItem(raw: VendorApiItem, i: number): VendorItem {
  const id = raw.id ?? raw.vendorId ?? raw.weddingHallId ?? i;
  const name = raw.name ?? raw.hallName ?? raw.vendorName ?? '업체';
  const region = raw.region ?? raw.area ?? raw.location ?? undefined;
  return { id, name, region };
}

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review'>('reserve');

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetOpen) return;
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_URL}/v1/vendor/wedding_hall`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(`목록 조회 실패 (${res.status})`);

        const json: unknown = await res.json();
        const list = pickList(json)
          .filter(isRecord)
          .map((v, idx) => toVendorItem(v as VendorApiItem, idx));

        if (!aborted) setVendors(list);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : '목록을 불러오지 못했어요.';
        if (!aborted) setErr(msg);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [sheetOpen, API_URL]);

  const hasVendors = useMemo(() => vendors.length > 0, [vendors]);

  return (
    <main className="min-h-screen bg-background pb-24">
      <Header value="마이" />

      <section className="px-5 pt-2 max-w-96 mx-auto">
        <div className="flex flex-col items-center gap-2 py-4">
          <SvgObject
            src="/defaultProfile.svg"
            alt="profile"
            width={88}
            height={88}
            className="rounded-full"
          />
          <div className="text-[17px] font-medium text-foreground">
            김수민 신부님
          </div>
          <a
            href="/mypage/connection"
            className="text-[13px] text-rose-400 underline underline-offset-4"
          >
            예비 배우자와 연결하기
          </a>
        </div>

        <DdayCard target="2026-05-10" className="w-80 h-36 mx-auto" />

        <div className="mt-6 flex items-center gap-6 px-1">
          <button
            onClick={() => setTab('reserve')}
            className={`pb-2 text-[17px] ${tab === 'reserve' ? 'text-foreground border-b-2 border-rose-300' : 'text-text-secondary'}`}
          >
            내 예약
          </button>
          <button
            onClick={() => setTab('review')}
            className={`pb-2 text-[17px] ${tab === 'review' ? 'text-foreground border-b-2 border-rose-300' : 'text-text-secondary'}`}
          >
            후기
          </button>
        </div>

        {tab === 'reserve' ? (
          <div className="mt-4 space-y-6">
            <div>
              <div className="mb-3 text-sm font-medium text-foreground">
                8월 30일
              </div>
              <div className="grid grid-cols-3 gap-3">
                {RESERVE_0830.map((c) => (
                  <CompanyCard
                    key={c.id}
                    region={c.region}
                    name={c.name}
                    imageSrc={c.imageSrc}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-medium text-foreground">
                8월 29일
              </div>
              <div className="grid grid-cols-3 gap-3 opacity-40">
                <CompanyCard
                  region="압구정"
                  name="정샘물"
                  imageSrc="/logos/jsm.png"
                />
                <CompanyCard
                  region="청담"
                  name="순수"
                  imageSrc="/logos/soonsoo.png"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-1 text-[15px] text-text-default font-medium">
                <span>최신순</span>
                <SvgObject
                  src="/icons/arrowDown.svg"
                  alt="arrow-down"
                  width={20}
                  height={20}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="w-28 h-28 rounded-lg outline-1 outline-offset-[-1px] outline-box-line flex flex-col items-center justify-center gap-2 text-text-secondary"
              >
                <SvgObject
                  src="/icons/plus.svg"
                  alt="plus"
                  width={26}
                  height={26}
                  className="rounded-full"
                />
                <span>후기작성</span>
              </button>

              {[
                {
                  id: 'w1',
                  region: '압구정',
                  name: '정샘물',
                  imageSrc: '/logos/jsm.png',
                  rating: { score: 4.8, count: 164 },
                },
                {
                  id: 'w2',
                  region: '청담',
                  name: '순수',
                  imageSrc: '/logos/soonsoo.png',
                  rating: { score: 4.5, count: 92 },
                },
              ].map((c: ReviewCompany) => (
                <CompanyCard
                  key={c.id}
                  variant="review"
                  region={c.region}
                  name={c.name}
                  imageSrc={c.imageSrc}
                  rating={c.rating}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <BottomNav innerMax="max-w-96" />
      <div className="h-16 pb-[env(safe-area-inset-bottom)]" />

      <CompanyModal open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="px-1 text-base font-semibold text-foreground">
          업체 선택
        </h3>

        {loading && (
          <div className="mt-3 grid gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md bg-gray-100"
              />
            ))}
          </div>
        )}

        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}

        {hasVendors && (
          <ul className="mt-2 max-h-[60vh] overflow-y-auto">
            {vendors.map((v) => (
              <li key={String(v.id)}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setSheetOpen(false);
                    const q = new URLSearchParams({
                      vendorId: String(v.id),
                      vendorName: v.name,
                    }).toString();
                    router.push(`/mypage/review?${q}`);
                  }}
                >
                  <span className="text-sm text-foreground">{v.name}</span>
                  {v.region && (
                    <span className="text-xs text-text-secondary">
                      {v.region}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && !err && !hasVendors && (
          <p className="mt-3 text-sm text-text-secondary">
            표시할 업체가 없습니다.
          </p>
        )}
      </CompanyModal>
    </main>
  );
}
