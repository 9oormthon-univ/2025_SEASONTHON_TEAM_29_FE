'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import SvgObject from '@/components/common/atomic/SvgObject';

type Props = {
  vendorTitle?: string;
  floor?: string;
  address?: string;
  lat?: number;
  lng?: number;
  className?: string;
};

const JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

export default function Location({
  vendorTitle = '아펠가모 선릉점',
  floor = '4층',
  address = '서울 강남구 테헤란로 322 한신인터밸리24빌딩',
  lat,
  lng,
  className,
}: Props) {
  const placeTitle = `${vendorTitle} | ${floor}`;

  const mapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!JS_KEY) {
      setError('카카오 JavaScript 키가 설정되어 있지 않습니다.');
      return;
    }

    const init = () => {
      if (!mapRef.current) return;
      const kakao = (window as any).kakao;

      const draw = (center: any) => {
        const map = new kakao.maps.Map(mapRef.current!, { center, level: 4 });
        new kakao.maps.Marker({ map, position: center });
      };

      if (pos) {
        draw(new kakao.maps.LatLng(pos.lat, pos.lng));
        return;
      }

      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const { x, y } = result[0];
          const c = new kakao.maps.LatLng(Number(y), Number(x));
          setPos({ lat: Number(y), lng: Number(x) });
          draw(c);
        } else {
          setError('주소를 좌표로 변환하지 못했습니다.');
        }
      });
    };
    if ((window as any).kakao?.maps) {
      init();
      return;
    }
    if (document.getElementById('kakao-map-sdk')) {
      const t = setInterval(() => {
        if ((window as any).kakao?.maps) {
          clearInterval(t);
          init();
        }
      }, 100);
      return;
    }

    const s = document.createElement('script');
    s.id = 'kakao-map-sdk';
    s.async = true;
    s.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${JS_KEY}&libraries=services`;
    s.onload = () => (window as any).kakao.maps.load(init);
    s.onerror = () => setError('카카오 지도 스크립트를 불러오지 못했습니다.');
    document.head.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JS_KEY, address, pos?.lat, pos?.lng]);
  return (
    <section
      className={clsx(
        'mx-auto w-[90%] max-w-[760px] text-primary-500',
        className,
      )}
      aria-label="Location"
    >
      <div className="flex items-center justify-center">
        <SvgObject
          src="/Location.svg"
          alt="Location"
          width={160}
          height={80}
          className="select-none"
        />
      </div>

      <div
        className="mt-3 text-center text-primary-400"
        style={{ fontFamily: 'DI, serif' }}
      >
        <div className="text-base">{placeTitle}</div>
        <div className="mt-1 text-sm">{address}</div>
      </div>

      <div
        ref={mapRef}
        className="mt-5 h-64 w-full rounded-xl bg-zinc-800/40"
        role="img"
        aria-label="카카오 지도"
      />

      <div className="mt-3 flex items-center justify-center gap-3">
        {error && <span className="text-xs text-primary-500/80">{error}</span>}
      </div>
    </section>
  );
}
