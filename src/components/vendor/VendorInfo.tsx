'use client';

import type { VendorCategory, VendorProductSummary } from '@/types/vendor';
import { MapPin, Phone } from 'lucide-react';

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  WEDDING_HALL: '웨딩홀',
  DRESS: '드레스',
  STUDIO: '스튜디오',
  MAKEUP: '메이크업',
};

const CATEGORY_WARNINGS: Record<VendorCategory, string> = {
  WEDDING_HALL: '예식 날짜, 시간대, 보증인원 수, 옵션추가에 따라 견적이 상이합니다.',
  STUDIO: '의상 수, 촬영 시간, 야외 씬 포함 여부, 작가 지정 경우 추가 비용이 발생할 수 있습니다.',
  MAKEUP: '담당자 지정, 헤어피스 및 혼주 추가 여부에 따라 가격이 상이합니다.',
  DRESS: '헬퍼 유무, 드레스종류, 퍼스트웨어 여부에 따라 추가비용이 발생할 수 있습니다.',
};

export default function VendorInfo({
  vendorName,
  vendorType,
  fullAddress,
  addressDetail,
  phoneNumber,
  kakaoMapUrl,
  products,
}: {
  vendorName: string;
  vendorType: VendorCategory;
  fullAddress: string;
  addressDetail?: string;
  phoneNumber?: string;
  kakaoMapUrl?: string;
  products: VendorProductSummary[];
}) {
  const tel = phoneNumber?.replaceAll('-', '');
  const categoryLabel = CATEGORY_LABELS[vendorType];
  const warningText = CATEGORY_WARNINGS[vendorType];

  // 최저가 계산
  const minPrice = products.length
    ? Math.min(...products.map((p) => p.basePrice))
    : null;

  return (
    <section className="px-4 py-4">
      {/* 상단 영역: 제목/주소 + 버튼 */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="mt-0.5 line-clamp-2 text-lg font-semibold tracking-tight">
            [{categoryLabel}] {vendorName}
          </h1>
          <p className="mt-1 text-[12px] text-gray-600">
            {fullAddress} {addressDetail}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!!kakaoMapUrl && (
            <a
              href={kakaoMapUrl}
              target="_blank"
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white active:scale-95"
              aria-label="지도 열기"
            >
              <MapPin className="h-4 w-4 text-gray-700" />
            </a>
          )}
          {!!tel && (
            <a
              href={`tel:${tel}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white active:scale-95"
              aria-label="전화하기"
            >
              <Phone className="h-4 w-4 text-gray-700" />
            </a>
          )}
        </div>
      </div>

      {/* 하단 영역: 가격/경고문 */}
      {minPrice !== null && (
        <p className="mt-3 text-2xl font-bold text-primary-400 leading-9">
          {minPrice.toLocaleString()}~
          <span className="text-sm ml-0.5 font-normal leading-normal">원</span>
        </p>
      )}

      <p className="mt-1 text-[11px] text-primary-500">{warningText}</p>
    </section>
  );
}