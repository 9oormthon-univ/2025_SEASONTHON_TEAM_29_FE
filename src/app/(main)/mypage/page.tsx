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
import type { VendorItem } from '@/types/reservation';
import Image from 'next/image';

type Company = { id: string; region: string; name: string; imageSrc: string };
type ReviewCompany = Company & { rating: { score: number; count?: number } };

type MyReservation = {
  id: number;
  vendorId: number;
  reservationDate: string;
  reservationTime: string;
  createdAt: string;
  updatedAt: string;
  vendorName?: string;
  vendorLogoUrl?: string;
  mainImageUrl?: string;
  vendorDescription?: string;
  vendorCategory?: string;
};

type ReservationApiItem = {
  id: number | string;
  vendorId: number | string;
  reservationDate: string;
  reservationTime?: string;
  createdAt?: string;
  updatedAt?: string;
  vendorName?: string;
  vendorLogoUrl?: string;
  mainImageUrl?: string;
  vendorDescription?: string;
  vendorCategory?: string;
};

type MyReviewCard = ReviewCompany;
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function pickList(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (isRecord(json) && Array.isArray(json.data)) return json.data as unknown[];
  if (isRecord(json) && Array.isArray(json.content))
    return json.content as unknown[];
  if (isRecord(json) && isRecord(json.data) && Array.isArray(json.data.content))
    return json.data.content as unknown[];
  return [];
}
function getHasNext(json: unknown): boolean {
  if (!isRecord(json)) return false;
  if (typeof json.last === 'boolean') return !json.last;
  if (typeof json.number === 'number' && typeof json.totalPages === 'number') {
    return json.number + 1 < json.totalPages;
  }
  if (isRecord(json.data)) {
    const d = json.data;
    if (typeof d.last === 'boolean') return !d.last;
    if (typeof d.number === 'number' && typeof d.totalPages === 'number') {
      return (d.number as number) + 1 < (d.totalPages as number);
    }
  }
  return false;
}
function isReservationApiItem(v: unknown): v is ReservationApiItem {
  if (!isRecord(v)) return false;
  return 'id' in v && 'vendorId' in v && 'reservationDate' in v;
}
function toMyReservation(r: ReservationApiItem): MyReservation {
  return {
    id: Number(r.id),
    vendorId: Number(r.vendorId),
    reservationDate: String(r.reservationDate),
    reservationTime: String(r.reservationTime ?? ''),
    createdAt: String(r.createdAt ?? ''),
    updatedAt: String(r.updatedAt ?? ''),
    vendorName: r.vendorName ? String(r.vendorName) : undefined,
    vendorLogoUrl: r.vendorLogoUrl ? String(r.vendorLogoUrl) : undefined, // 👈 매핑
    mainImageUrl: r.mainImageUrl ? String(r.mainImageUrl) : undefined,
    vendorDescription: r.vendorDescription
      ? String(r.vendorDescription)
      : undefined,
    vendorCategory: r.vendorCategory ? String(r.vendorCategory) : undefined,
  };
}
function toMyReviewCard(v: unknown): MyReviewCard | null {
  if (!isRecord(v)) return null;
  const id =
    (typeof v.reviewId === 'number' || typeof v.reviewId === 'string'
      ? v.reviewId
      : typeof v.id === 'number' || typeof v.id === 'string'
        ? v.id
        : null) ?? null;
  const name =
    typeof v.vendorName === 'string'
      ? v.vendorName
      : `업체 #${String(id ?? '')}`;
  const region = typeof v.vendorRegion === 'string' ? v.vendorRegion : '-';
  const imageSrc =
    typeof v.vendorLogoUrl === 'string'
      ? v.vendorLogoUrl
      : '/logos/placeholder.png';
  const score =
    typeof v.rating === 'number'
      ? v.rating
      : typeof v.score === 'number'
        ? v.score
        : 0;

  if (id == null) return null;
  return {
    id: String(id),
    name,
    region,
    imageSrc,
    rating: { score, count: undefined },
  };
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  return '요청에 실패했어요.';
}
function labelFromISODate(iso: string) {
  const [, mm, dd] = iso.split('-');
  return `${Number(mm)}월 ${Number(dd)}일`;
}

function getStringProp(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}
function pickVendorLogo(
  vendor: VendorItem | undefined,
  res?: MyReservation,
): string {
  return (
    res?.vendorLogoUrl ??
    getStringProp(vendor, 'logoImageUrl') ??
    getStringProp(vendor, 'logoUrl') ??
    getStringProp(vendor, 'logo') ??
    res?.mainImageUrl ??
    '/logos/placeholder.png'
  );
}

export default function Page() {
  const [tab, setTab] = useState<'reserve' | 'review'>('reserve');

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  const [sheetOpen, setSheetOpen] = useState(false);

  const [vendors] = useState<VendorItem[]>([]);

  const [myReservations, setMyReservations] = useState<MyReservation[]>([]);
  const [resLoading, setResLoading] = useState(false);
  const [resErr, setResErr] = useState<string | null>(null);

  const [myReviews, setMyReviews] = useState<MyReviewCard[]>([]);
  const [revLoading, setRevLoading] = useState(false);
  const [revErr, setRevErr] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const SIZE = 9;
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
        const json = (await res.json()) as unknown;
        const list = pickList(json).filter(isReservationApiItem);
        const data = list.map(toMyReservation);
        if (!aborted) setMyReservations(data);
      } catch (e: unknown) {
        if (!aborted) setResErr(getErrorMessage(e));
      } finally {
        if (!aborted) setResLoading(false);
      }
    };
    loadReservations();
    return () => {
      aborted = true;
    };
  }, [API_URL]);

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
  const loadMyReviews = async (p: number, append: boolean) => {
    setRevLoading(true);
    setRevErr(null);
    try {
      const token = tokenStore.get();
      const url = `${API_URL}/v1/review/my-reviews?page=${p}&size=${SIZE}`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`후기 조회 실패 (${res.status})`);

      const json = (await res.json()) as unknown;
      const list = pickList(json);
      const parsed = list
        .map(toMyReviewCard)
        .filter((v): v is MyReviewCard => v !== null);

      setMyReviews((prev) => (append ? [...prev, ...parsed] : parsed));
      setHasMore(getHasNext(json));
      setPage(p);
    } catch (e: unknown) {
      setRevErr(getErrorMessage(e));
      if (!append) setMyReviews([]);
      setHasMore(false);
    } finally {
      setRevLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== 'review') return;
    if (myReviews.length === 0 && !revLoading) {
      void loadMyReviews(0, false);
    }
  }, [tab, API_URL, myReviews.length, revLoading]);

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
                    const name =
                      r.vendorName ?? v?.name ?? `업체 #${r.vendorId}`;

                    const logo = pickVendorLogo(v, r);

                    return (
                      <CompanyCard
                        key={r.id}
                        region={v?.region ?? '-'}
                        name={name}
                        imageSrc={logo}
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
              {myReviews.map((c) => (
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
            {revLoading && (
              <div className="mt-4 grid gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-md bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            )}
            {revErr && <p className="mt-3 text-sm text-red-500">{revErr}</p>}
            {!revLoading && !revErr && myReviews.length === 0 && (
              <p className="mt-3 text-sm text-text-secondary">
                작성한 후기가 없습니다.
              </p>
            )}
            {!revLoading && hasMore && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  className="px-4 h-10 rounded-lg outline outline-1 outline-box-line text-sm"
                  onClick={() => loadMyReviews(page + 1, true)}
                >
                  더 보기
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <BottomNav innerMax="max-w-96" />
      <div className="h-16 pb-[env(safe-area-inset-bottom)]" />

      <CompanyModal open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h3 className="px-1 text-base font-semibold text-foreground">
          업체 선택
        </h3>

        <div className="mt-3">
          <div className="mb-2 text-sm font-medium text-foreground">
            내 예약에서 선택
          </div>

          {resLoading && (
            <div className="grid gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-md bg-gray-100"
                />
              ))}
            </div>
          )}

          {resErr && <p className="text-sm text-red-500">{resErr}</p>}

          {!resLoading && !resErr && myReservations.length === 0 && (
            <p className="text-sm text-text-secondary">예약된 내역이 없어요.</p>
          )}

          {myReservations.length > 0 && (
            <ul className="max-h-[60vh] overflow-y-auto rounded-md border border-gray-100">
              {myReservations
                .slice()
                .sort((a, b) =>
                  b.reservationDate.localeCompare(a.reservationDate),
                )
                .map((r) => {
                  const v = vendorMap[String(r.vendorId)];
                  const vendorName =
                    r.vendorName ?? v?.name ?? `업체 #${r.vendorId}`;
                  const vendorRegion = v?.region ?? '-';
                  const logo = pickVendorLogo(v, r);

                  const when =
                    `${labelFromISODate(r.reservationDate)} ${r.reservationTime || ''}`.trim();

                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                        onClick={() => {
                          setSheetOpen(false);
                          const q = new URLSearchParams({
                            vendorId: String(r.vendorId),
                            vendorName,
                            reservationId: String(r.id),
                            date: r.reservationDate,
                            time: r.reservationTime,
                          }).toString();
                          router.push(`/mypage/review?${q}`);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={logo}
                            alt={vendorName}
                            width={28}
                            height={28}
                            className="h-7 w-7 rounded-md object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm text-foreground">
                              {vendorName}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {when}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-text-tertiary">
                          {vendorRegion}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </CompanyModal>
    </main>
  );
}
