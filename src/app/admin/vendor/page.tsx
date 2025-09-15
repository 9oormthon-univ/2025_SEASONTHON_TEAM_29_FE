'use client';

import CrudPanel from '@/components/admin/CrudPanel';
import JsonPreview from '@/components/admin/JsonPreview';
import { NumberField } from '@/components/admin/NumberField';
import { SelectField } from '@/components/admin/SelectField';
import { TextField } from '@/components/admin/TextField';
import UploadField from '@/components/admin/UploadField';
import RegionSearchField from '@/components/common/RegionSearchField';
import { fetchBuildingNameByCoord, fetchLatLngByKeyword } from '@/lib/kakao';
import { createVendor, getVendorDetail, getVendorsByCategory } from '@/services/vendor.api';
import type { VendorCategory, VendorDetail, VendorListItem } from '@/types/vendor';
import { useState } from 'react';

export default function VendorAdminPage() {
  // 조회
  const [list, setList] = useState<VendorListItem[]>([]);
  const [detail, setDetail] = useState<VendorDetail | null>(null);
  const [detailId, setDetailId] = useState<string>('');

  // 생성 폼 상태
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [vendorType, setVendorType] = useState<VendorCategory>('WEDDING_HALL');
  const [regionCode, setRegionCode] = useState<number>(0);
  const [fullAddress, setFullAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [kakaoMapUrl, setKakaoMapUrl] = useState('');
  const [floorEtc, setFloorEtc] = useState('');

  const [logo, setLogo] = useState<{ mediaKey: string; contentType: string } | null>(null);
  const [main, setMain] = useState<{ mediaKey: string; contentType: string } | null>(null);

  // 업체명 검색 상태
  const [keyword, setKeyword] = useState('');

  return (
    <div className="space-y-6">
      {/* ===== 조회 패널 ===== */}
      <CrudPanel
        title="Vendor 조회"
        actions={[
          {
            label: '웨딩홀 10개',
            onClick: async () =>
              setList((await getVendorsByCategory('WEDDING_HALL', 0, 10)).content),
          },
          {
            label: '상세 조회',
            onClick: async () => setDetail(await getVendorDetail(Number(detailId))),
            disabled: !Number(detailId),
          },
        ]}
      >
        <div className="flex gap-2 items-center">
          <input
            className="border px-2 py-1"
            placeholder="vendorId"
            value={detailId}
            onChange={(e) => setDetailId(e.target.value)}
          />
        </div>
        <JsonPreview data={list} />
        {detail && <JsonPreview data={detail} />}
      </CrudPanel>

      {/* ===== 생성 패널 ===== */}
      <CrudPanel
        title="Vendor 생성"
        actions={[
          {
            label: '생성',
            onClick: async () => {
              if (!logo || !main) return alert('이미지 업로드 먼저');
              if (!regionCode) return alert('행정구역(regionCode)을 선택하세요');
              if (!fullAddress) return alert('fullAddress를 입력하세요');
              if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                return alert('위/경도(lat/lng)를 확인하세요');
              }

              await createVendor({
                name,
                phoneNumber,
                description,
                vendorType,
                regionCode,
                logoImage: logo,
                mainImage: main,
                fullAddress,
                addressDetail: addressDetail || undefined,
                latitude,
                longitude,
                kakaoMapUrl: kakaoMapUrl || undefined,
              });
              alert('생성 완료');
            },
          },
        ]}
      >
        {/* 기본 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
          <TextField label="업체명" value={name} onChange={setName} />
          <TextField label="전화번호" value={phoneNumber} onChange={setPhoneNumber} />
          <TextField label="설명" value={description} onChange={setDescription} />
          <SelectField
            label="Vendor Type"
            value={vendorType}
            onChange={(v) => setVendorType(v as VendorCategory)}
            options={['WEDDING_HALL', 'STUDIO', 'DRESS', 'MAKEUP'] as const}
          />

          {/* 행정구역 검색 */}
          <div>
            <label className="block text-sm font-medium mb-1">행정구역 선택</label>
            <RegionSearchField
              onSelect={(code, name) => {
                setRegionCode(code);
                setFullAddress(name); // 기본 주소 채움
              }}
            />
            <p className="text-xs text-gray-500 mt-1">선택된 regionCode: {regionCode}</p>
          </div>

          <TextField label="fullAddress" value={fullAddress} onChange={setFullAddress} />
          <TextField label="addressDetail" value={addressDetail} onChange={setAddressDetail} />
          <NumberField label="latitude" value={latitude} onChange={setLatitude} />
          <NumberField label="longitude" value={longitude} onChange={setLongitude} />
          <TextField label="kakaoMapUrl" value={kakaoMapUrl} onChange={setKakaoMapUrl} />
        </div>

        {/* 업체명 검색으로 좌표 얻기 */}
        <div className="col-span-1 md:col-span-2 flex flex-wrap items-center gap-2 mt-2">
          <input
            type="text"
            className="border px-2 py-1 flex-1"
            placeholder="업체명으로 검색 (예: 청담 겐그레아)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type="button"
            className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            onClick={async () => {
              if (!keyword.trim()) return alert('업체명을 입력하세요');

              // 1) 키워드 → 좌표/주소
              const hit = await fetchLatLngByKeyword(keyword);
              if (!hit) return alert('좌표를 찾지 못했습니다.');

              setLatitude(hit.lat);
              setLongitude(hit.lng);
              setFullAddress(hit.fullAddress);
              setKakaoMapUrl(prev => prev || hit.placeUrl);

              // 2) 좌표 → 빌딩명 추출 (있으면 addressDetail 프리필)
              const building = await fetchBuildingNameByCoord(hit.lng, hit.lat);
              if (building) setAddressDetail(building);

              alert(`좌표 조회 완료: ${hit.lat}, ${hit.lng}`);
            }}
          >
            업체명 검색
          </button>
        </div>

        <input
          type="text"
          className="border px-2 py-1 w-40"
          placeholder="층/호 (예: 3-4층)"
          value={floorEtc}
          onChange={(e) => setFloorEtc(e.target.value)}
        />
        <button
          type="button"
          className="px-2 py-1 rounded border text-sm"
          onClick={() => {
            const base = (addressDetail || '').trim();
            const extra = floorEtc.trim();
            const merged = [base, extra].filter(Boolean).join(' ');
            setAddressDetail(merged);
          }}
        >
          층/호 합치기
        </button>

          <UploadField label="로고 업로드" domain="VENDOR" onDone={setLogo} />
          <UploadField label="대표 업로드" domain="VENDOR" onDone={setMain} />


        {/* 미리보기 */}
        <JsonPreview
          data={{
            preview:
              logo && main
                ? {
                    name,
                    phoneNumber,
                    description,
                    vendorType,
                    regionCode,
                    fullAddress,
                    addressDetail,
                    latitude,
                    longitude,
                    kakaoMapUrl,
                    logoImage: logo,
                    mainImage: main,
                  }
                : null,
          }}
        />
      </CrudPanel>
    </div>
  );
}