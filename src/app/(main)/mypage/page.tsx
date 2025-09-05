'use client';

import BottomNav from '@/components/common/atomic/BottomNav';
import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import CompanyCard from '@/components/Mypage/CompanyCard';
import DdayCard from '@/components/Mypage/D-dayCheck';
import CompanyModal from './CompanyModal';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { tokenStore } from '@/lib/tokenStore';

type Company = { id: string; region: string; name: string; imageSrc: string };
type ReviewCompany = Company & { rating: { score: number; count?: number } };

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

type MyReservation = {
  id: number;
  vendorId: number;
  reservationDate: string;
  reservationTime: string;
  createdAt: string;
  updatedAt: string;
};

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
function labelFromISODate(iso: string) {
  const [, mm, dd] = iso.split('-');
  return `${Number(mm)}월 ${Number(dd)}일`;
}

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review'>('reserve');

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const [sheetOpen, setSheetOpen] = useState(false);

  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsErr, setVendorsErr] = useState<string | null>(null);

  const [myReservations, setMyReservations] = useState<MyReservation[]>([]);
  const [resLoading, setResLoading] = useState(false);
  const [resErr, setResErr] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const loadReservations = async () => {
      try {
        setResLoading(true);
        setResErr(null);
        const token = tokenStore.get();
        const res = await fetch(`${API_URL}/v1/reservation/`, {
          cache: 'no-store',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (!res.ok) throw new Error(`예약 조회 실패 (${res.status})`);
        const json: any = await res.json();
        const list = pickList(json).filter(isRecord) as any[];
        const data: MyReservation[] = list.map((r) => ({
          id: Number(r.id),
          vendorId: Number((r as any).vendorId),
          reservationDate: String((r as any).reservationDate),
          reservationTime: String((r as any).reservationTime ?? ''),
          createdAt: String((r as any).createdAt ?? ''),
          updatedAt: String((r as any).updatedAt ?? ''),
        }));
        if (!aborted) setMyReservations(data);
      } catch (e: any) {
        if (!aborted) setResErr(e?.message ?? '예약을 불러오지 못했어요.');
      } finally {
        if (!aborted) setResLoading(false);
      }
    };
    loadReservations();
    return () => {
      aborted = true;
    };
  }, [API_URL]);

  useEffect(() => {
    if (!sheetOpen) return;
    let aborted = false;
    (async () => {
      try {
        setVendorsLoading(true);
        setVendorsErr(null);
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
        if (!aborted) setVendorsErr(msg);
      } finally {
        if (!aborted) setVendorsLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [sheetOpen, API_URL]);

  const vendorMap: Record<string, VendorItem> = useMemo(() => {
    const m: Record<string, VendorItem> = {};
    for (const v of vendors) m[String(v.id)] = v;
    return m;
  }, [vendors]);

  const groupedReservations = useMemo(() => {
    const map = new Map<string, MyReservation[]>();
    for (const r of myReservations) {
      const key = r.reservationDate;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [myReservations]);

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
            {resLoading && (
              <div className="grid gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 w-80 mx-auto rounded-lg bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            )}
            {resErr && <p className="text-sm text-red-500">{resErr}</p>}
            {!resLoading && !resErr && groupedReservations.length === 0 && (
              <p className="text-sm text-text-secondary">
                예약 내역이 없습니다.
              </p>
            )}
            {groupedReservations.map(([isoDate, items]) => (
              <div key={isoDate}>
                <div className="mb-3 text-sm font-medium text-foreground">
                  {labelFromISODate(isoDate)}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {items.map((r) => {
                    const v = vendorMap[String(r.vendorId)];
                    return (
                      <CompanyCard
                        key={r.id}
                        region={v?.region ?? '-'}
                        name={v?.name ?? `업체 #${r.vendorId}`}
                        imageSrc="/logos/placeholder.png"
                      />
                    );
                  })}
                </div>
              </div>
            ))}
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

        {vendorsLoading && (
          <div className="mt-3 grid gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-md bg-gray-100"
              />
            ))}
          </div>
        )}

        {vendorsErr && (
          <p className="mt-3 text-sm text-red-500">{vendorsErr}</p>
        )}

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

        {!vendorsLoading && !vendorsErr && !hasVendors && (
          <p className="mt-3 text-sm text-text-secondary">
            표시할 업체가 없습니다.
          </p>
        )}
      </CompanyModal>
    </main>
  );
}
