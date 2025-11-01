// src/components/search/MapSearchPage.tsx
'use client';

import { useKakaoSdkReady } from '@/hooks/useKakaoSdkReady';
import { searchDresses } from '@/services/search/dress.api';
import { searchWeddingHalls } from '@/services/search/hall.api';
import { searchMakeups } from '@/services/search/makeup.api';
import { searchStudios } from '@/services/search/studio.api';
import { getVendorDetail } from '@/services/vendor.api';
import type { SearchItem } from '@/types/search';
import type { VendorCategory, VendorDetail } from '@/types/vendor';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import SvgObject from '../common/atomic/SvgObject';
import Header from '../common/monocules/Header';

// 카카오맵 타입은 `src/types/kakao.maps.d.ts`에 선언되어 있음
// 카테고리 아이콘 경로 (homeData.ts와 동일)
const CATEGORY_ICON_PATH: Record<VendorCategory, string> = {
  WEDDING_HALL: '/icons/Category/weddinghall.svg',
  DRESS: '/icons/Category/dress.svg',
  STUDIO: '/icons/Category/studio.svg',
  MAKEUP: '/icons/Category/makeup.svg',
};

// (colors 제거)

// 카테고리 한글명 매핑
const categoryNames: Record<VendorCategory, string> = {
  WEDDING_HALL: '웨딩홀',
  DRESS: '드레스',
  STUDIO: '스튜디오',
  MAKEUP: '메이크업',
};

// (보류) 커스텀 애니메이션 이징이 필요하면 활성화

export default function MapSearchPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const markerMapRef = useRef<Map<number, { marker: KakaoMarker; normalImg: unknown; selectedImg: unknown }>>(new Map());
  const selectedVendorIdRef = useRef<number | null>(null);
  const iconImgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const markerImageCacheRef = useRef<Map<string, { normal: KakaoMarkerImage; selected: KakaoMarkerImage }>>(new Map());
  const [selectedStore, setSelectedStore] = useState<VendorDetail | null>(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragYRef = useRef(0);
  const dragMovedRef = useRef(false);
  const [vendors, setVendors] = useState<VendorDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const kakaoReady = useKakaoSdkReady();
  const hasFetchedRef = useRef(false);
  const detailCacheRef = useRef<Map<number, VendorDetail>>(new Map());

  // Projection 기반 오프셋 panTo: 중앙 살짝 위로
  const panToWithOffsetOnce = useCallback((m: KakaoMap, lat: number, lng: number, _offsetY = 160) => {
    try {
      const kakao = window.kakao;
      const proj = m.getProjection?.();
      if (!proj) {
        m.panTo(new kakao.maps.LatLng(lat, lng));
        return;
      }
      const base = new kakao.maps.LatLng(lat, lng);
      const pt = proj.pointFromCoords(base);
      const shifted = new kakao.maps.Point(pt.x, pt.y + 80);
      const target = proj.coordsFromPoint(shifted);
      m.panTo(target);
    } catch {
      const kakao = window.kakao;
      m.panTo(new kakao.maps.LatLng(lat, lng));
    }
  }, []);

  const loadCategoryIcon = useCallback(async (type: VendorCategory) => {
    const path = CATEGORY_ICON_PATH[type];
    const cached = iconImgCacheRef.current.get(path);
    if (cached) return cached;
    const img = new Image();
    img.src = path;
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('icon load failed'));
    });
    iconImgCacheRef.current.set(path, img);
    return img;
  }, []);

  const createBubbleDataUrl = useCallback(async (bg: string, stroke: string, size: number, type: VendorCategory) => {
    const icon = await loadCategoryIcon(type);
    const w = size;
    const tail = Math.max(6, Math.round(size * 0.25));
    const h = size + tail;
    const cx = w / 2;
    const cy = size / 2;
    const r = size / 2 - 2;
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const c = document.createElement('canvas');
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    // HiDPI 스케일
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingQuality = 'high';
    // 말풍선 원
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    // 꼬리
    ctx.moveTo(cx - 6, size - 2);
    ctx.lineTo(cx, h - 2);
    ctx.lineTo(cx + 6, size - 2);
    ctx.closePath();
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    // 카테고리 아이콘 (정비율로 contain)
    const maxIcon = Math.floor(size * 0.56);
    const ratio = Math.min(maxIcon / icon.width, maxIcon / icon.height);
    const iw = Math.max(1, Math.round(icon.width * ratio));
    const ih = Math.max(1, Math.round(icon.height * ratio));
    ctx.drawImage(icon, Math.round(cx - iw / 2), Math.round(cy - ih / 2), iw, ih);
    return c.toDataURL();
  }, [loadCategoryIcon]);

  const getBubbleMarkerImages = useCallback(async (type: VendorCategory, baseSize: number, selSize: number) => {
    // 색상: 기본(연한 핑크) / 선택(메인 핑크)
    const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim() || '#ff6669';
    const primaryLight = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-400').trim() || '#ff9b9d';
    const key = `${type}-${baseSize}-${selSize}`;
    const cached = markerImageCacheRef.current.get(key);
    if (cached) return cached;
    
    const normalUrl = await createBubbleDataUrl('#ffffff', primaryLight, baseSize, type);
    const selectedUrl = await createBubbleDataUrl('#ffffff', primary, selSize, type);
    const normal = new window.kakao.maps.MarkerImage(
      normalUrl,
      new window.kakao.maps.Size(baseSize, baseSize + Math.max(6, Math.round(baseSize * 0.25))),
      { offset: new window.kakao.maps.Point(baseSize / 2, baseSize / 2) },
    ) as unknown as KakaoMarkerImage;
    const selected = new window.kakao.maps.MarkerImage(
      selectedUrl,
      new window.kakao.maps.Size(selSize, selSize + Math.max(6, Math.round(selSize * 0.25))),
      { offset: new window.kakao.maps.Point(selSize / 2, selSize / 2) },
    ) as unknown as KakaoMarkerImage;
    const ret = { normal, selected };
    markerImageCacheRef.current.set(key, ret);
    return ret;
  }, [createBubbleDataUrl]);

  const highlightMarker = (vendorId: number) => {
    const prevId = selectedVendorIdRef.current;
    if (prevId && markerMapRef.current.has(prevId)) {
      const prev = markerMapRef.current.get(prevId)!;
      (prev.marker as KakaoMarker).setImage?.(prev.normalImg as unknown as KakaoMarkerImage);
      (prev.marker as unknown as { setImage?: (img: unknown) => void; setZIndex?: (z: number) => void }).setZIndex?.(0);
    }
    const cur = markerMapRef.current.get(vendorId);
    if (cur) {
      (cur.marker as KakaoMarker).setImage?.(cur.selectedImg as unknown as KakaoMarkerImage);
      (cur.marker as unknown as { setImage?: (img: unknown) => void; setZIndex?: (z: number) => void }).setZIndex?.(999);
      selectedVendorIdRef.current = vendorId;
    }
  };

  // 모든 카테고리의 벤더 데이터 가져오기 (조건 없이 전체 검색 → 상세조회로 좌표 확보)
  const fetchAllVendors = useCallback(async () => {
    try {
      setLoading(true);
      const fetchers = [
        async () => ({
          type: 'WEDDING_HALL' as VendorCategory,
          res: await searchWeddingHalls({ page: 0, size: 50 }, { skipAuth: true }),
        }),
        async () => ({
          type: 'DRESS' as VendorCategory,
          res: await searchDresses({ page: 0, size: 50 }, { skipAuth: true }),
        }),
        async () => ({
          type: 'STUDIO' as VendorCategory,
          res: await searchStudios({ page: 0, size: 50 }, { skipAuth: true }),
        }),
        async () => ({
          type: 'MAKEUP' as VendorCategory,
          res: await searchMakeups({ page: 0, size: 50 }, { skipAuth: true }),
        }),
      ];

      const allVendors: VendorDetail[] = [];
      // 상세 조회 캐시 헬퍼
      const getVendorDetailCached = async (id: number) => {
        const cached = detailCacheRef.current.get(id);
        if (cached) return cached;
        const d = await getVendorDetail(id, { skipAuth: true });
        detailCacheRef.current.set(id, d);
        return d;
      };

      // 동시 요청 제한 (10개)
      const fetchDetails = async (ids: number[]) => {
        const results: VendorDetail[] = [];
        for (let i = 0; i < ids.length; i += 10) {
          const slice = ids.slice(i, i + 10);
          const chunk = await Promise.all(
            slice.map((id) => getVendorDetailCached(id).catch(() => null)),
          );
          chunk.forEach((d) => d && results.push(d as VendorDetail));
        }
        return results;
      };

      for (const run of fetchers) {
        try {
          const { type, res } = await run();
          const items = res.items as SearchItem[];
          const ids = items.map((i) => i.id);
          const byId = new Map<number, SearchItem>(items.map((i) => [i.id, i]));
          const details = await fetchDetails(ids);
          details.forEach((d) => {
            if (!d) return;
            // 안전하게 필요한 최소 필드만 보존
            allVendors.push({
              vendorId: d.vendorId,
              vendorName: d.vendorName,
              vendorType: type,
              fullAddress: d.fullAddress,
              latitude: d.latitude,
              longitude: d.longitude,
              repMediaUrl: d.repMediaUrl,
              averageRating: byId.get(d.vendorId)?.rating,
              reviewCount: byId.get(d.vendorId)?.count,
              products: d.products,
            });
          });
        } catch (e) {
          console.error('failed to load vendors for type', e);
        }
      }

      setVendors(allVendors);
      console.log('[MapSearch] vendors loaded:', allVendors.length);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAllVendors();
  }, [fetchAllVendors]);

  // 핵심: 지도를 SDK의 load 이벤트에서만 생성
  useEffect(() => {
    if (!kakaoReady) return;
    function tryInit() {
      if (!mapRef.current) {
        console.log('지도 div는 있지만 mapRef가 아직 없음(폴링)');
        setTimeout(tryInit, 50);
        return;
      }
      if (!window.kakao?.maps?.load) {
        console.log('window.kakao.maps.load가 아직 없음');
        setTimeout(tryInit, 50);
        return;
      }
      window.kakao.maps.load(() => {
        console.log('지도 SDK load 콜백 진입');
        const mapInstance = new window.kakao.maps.Map(mapRef.current as HTMLElement, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 8,
        });
        setMap(mapInstance);
        console.log('setMap 실행!');
      });
    }
    tryInit();
  }, [kakaoReady]);

  // 벤더 데이터가 로드되면 마커 생성(지도 객체 생성 이후부터)
  useEffect(() => {
    if (!map || vendors.length === 0) return;
    console.log('[MapSearch] creating markers for', vendors.length, 'vendors');
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markerMapRef.current.clear();
    const newMarkers: KakaoMarker[] = [];
    const build = async () => {
      for (const vendor of vendors) {
      const pos = new window.kakao.maps.LatLng(vendor.latitude, vendor.longitude);
        const baseSize = 32; // 조금 확대
        const selSize = 40;
        const imgs = await getBubbleMarkerImages(vendor.vendorType, baseSize, selSize);
        const marker = new window.kakao.maps.Marker({ position: pos, map: map ?? undefined, title: vendor.vendorName }) as KakaoMarker;
        marker.setImage?.(imgs.normal as unknown as KakaoMarkerImage);
        window.kakao.maps.event.addListener(marker, 'click', async () => {
          if (map) panToWithOffsetOnce(map, vendor.latitude, vendor.longitude, 170);
          highlightMarker(vendor.vendorId);
          setSelectedStore({ ...vendor });
          try {
            const detail = await getVendorDetail(vendor.vendorId, { skipAuth: true });
            setSelectedStore({
              ...detail,
              averageRating: vendor.averageRating,
              reviewCount: vendor.reviewCount,
            });
          } catch {}
        });
        newMarkers.push(marker);
        markerMapRef.current.set(vendor.vendorId, { marker, normalImg: imgs.normal, selectedImg: imgs.selected });
      }
    };
    build();
    markersRef.current = newMarkers;
  }, [map, vendors, panToWithOffsetOnce, getBubbleMarkerImages]);

  // (마커 커스텀 이미지는 추후 적용 가능)

  // no-op

  const handleBack = () => {
    router.back();
  };

  return (
    <main className="mx-auto w-full h-dvh flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] px-4">
      <Header showBack onBack={handleBack} value="지도로 검색" />
      {/* 지도 영역 div는 항상 렌더됨 */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-gray-200">
        <div
          ref={el => {
            mapRef.current = el;
          }}
          className="w-full h-full"
          style={{ height: '100%' }}
        />
        {/* 지도/매장 로딩 시 오버레이 */}
        {(loading || !map) && (
          <div className="absolute z-10 inset-0 flex items-center justify-center bg-white/70">
            <div className="text-gray-500">
              {loading ? '매장 정보를 불러오는 중...' : '지도를 불러오는 중...'}
            </div>
          </div>
        )}
        {/* 결과 요약 배지 */}
        {!!vendors.length && (
          <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs shadow">
            총 {vendors.length}개 매장
          </div>
        )}
        {/* 선택된 매장 바텀시트 (드래그로 내리기) */}
        {selectedStore && (
          <div
            className="fixed inset-x-0 z-30 w-full select-none"
            style={{ bottom: 'env(safe-area-inset-bottom)', transform: `translateY(${dragY}px)` }}
            onPointerDown={(e) => {
              setDragging(true);
              const startY = (e as unknown as PointerEvent).clientY ?? 0;
              const onMove = (ev: PointerEvent) => {
                const curY = ev.clientY ?? 0;
                const dy = Math.max(0, curY - startY);
                setDragY(dy);
                dragYRef.current = dy;
                if (dy > 4) dragMovedRef.current = true;
              };
              const onUp = () => {
                setDragging(false);
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                const finalY = dragYRef.current;
                if (finalY > 120) {
                  setSelectedStore(null);
                  setDragY(0);
                } else {
                  setDragY(0);
                }
                // 드래그 종료 후 클릭 허용 복원
                setTimeout(() => {
                  dragMovedRef.current = false;
                }, 0);
              };
              window.addEventListener('pointermove', onMove);
              window.addEventListener('pointerup', onUp);
            }}
          >
            <div
              className={`w-full rounded-t-2xl bg-white shadow-xl overflow-hidden border-t border-gray-200 ${dragging ? '' : 'transition-transform duration-200'}`}
              onClick={() => {
                if (dragMovedRef.current) return; // 드래그 후 클릭 무시
                if (selectedStore) router.push(`/vendor/${selectedStore.vendorId}`);
              }}
              role="button"
              tabIndex={0}
            >
              {/* Drag handle */}
              <div className="py-2 grid place-items-center">
                <div className="h-1.5 w-10 rounded-full bg-gray-300" />
              </div>
              {/* 상단 정보 블럭: 이름/카테고리 */}
              <div className="px-4">
                <div className="flex items-center gap-2">
                  <div className="text-[18px] text-gray-900 truncate">{selectedStore.vendorName}</div>
                  <div className="text-[12px] text-gray-400">{categoryNames[selectedStore.vendorType]}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
              {/* 별점 (검색 결과 카드와 동일 스타일) */}
              {(selectedStore.averageRating != null || selectedStore.reviewCount != null) && (
                <div className="pl-4 flex items-center gap-1 text-xs text-gray-600">
                  <SvgObject src="/icons/PinkRing.svg" alt="rating-ring" width={12} height={12} />
                  <span className="font-medium">{(selectedStore.averageRating ?? 0).toFixed(1)}</span>
                  <span className="text-gray-500">({selectedStore.reviewCount ?? 0})</span>
                </div>
              )}
              
              {/* 주소 */}
              <div className="pl-2 text-[12px] text-gray-500 truncate">{selectedStore.fullAddress}</div>
              
              </div>
              
              {/* 가격 */}
              {!!selectedStore.products?.length && (
                <div className="px-4 pb-3 text-primary-500 font-bold">{Math.min(...selectedStore.products.map((p) => p.basePrice)).toLocaleString()}원~</div>
              )}
              {/* 이미지 스크롤 */}
              <div className="px-4 pb-4">
                <div className="flex gap-2 overflow-x-auto">
                  {!!selectedStore.repMediaUrl && (
                    <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <NextImage src={selectedStore.repMediaUrl} alt="" fill sizes="144px" className="object-cover" />
                    </div>
                  )}
                  {(selectedStore.products ?? [])
                    .flatMap((p) => p.imageUrls)
                    .slice(0, 5)
                    .map((src, idx) => (
                      <div key={idx} className="relative h-36 w-36 shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <NextImage src={src} alt="" fill sizes="144px" className="object-cover" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}