'use client';

import type {
  CreateDressProduct,
  CreateMakeupProduct,
  CreateProductRequest,
  CreateStudioProduct,
  CreateWeddingHallProduct,
  VendorCategory,
} from '@/types/vendor';
import { useEffect, useState } from 'react';
import ImageListField from './ImageListField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { TextField } from './TextField';

type ProductForm =
  | CreateWeddingHallProduct
  | CreateStudioProduct
  | CreateDressProduct
  | CreateMakeupProduct;

export default function DynamicProductForm({
  vendorType,
  onChange,
}: {
  vendorType: VendorCategory;
  onChange: (form: CreateProductRequest) => void;
}) {
  // 공통 필드
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [images, setImages] = useState<
    { mediaKey: string; contentType: string; sortOrder: number }[]
  >([]);

  // 타입별 상세
  const [hall, setHall] = useState<Pick<CreateWeddingHallProduct, 'hallStyle' | 'hallMeal' | 'capacity' | 'hasParking'>>({
    hallStyle: 'HOTEL',
    hallMeal: 'BUFFET',
    capacity: 0,
    hasParking: false,
  });
  const [studio, setStudio] = useState<Pick<CreateStudioProduct, 'studioStyle' | 'specialShot' | 'iphoneSnap'>>({
    studioStyle: 'PORTRAIT_FOCUSED',
    specialShot: undefined,
    iphoneSnap: false,
  });
  const [dress, setDress] = useState<Pick<CreateDressProduct, 'dressStyle' | 'dressProduction'>>({
    dressStyle: 'ROMANTIC',
    dressProduction: 'DOMESTIC',
  });
  const [makeup, setMakeup] = useState<Pick<CreateMakeupProduct, 'makeupStyle' | 'isStylistDesignationAvailable' | 'hasPrivateRoom'>>({
    makeupStyle: 'NATURAL',
    isStylistDesignationAvailable: false,
    hasPrivateRoom: false,
  });

  // 폼이 바뀔 때마다 상위에 전달
  useEffect(() => {
    let body: ProductForm;
  
    if (vendorType === 'WEDDING_HALL') {
      body = {
        vendorType: 'WEDDING_HALL', // 🔑 이렇게 리터럴 고정
        name,
        description,
        basePrice,
        durationInMinutes: duration,
        productImages: images,
        ...hall,
      };
    } else if (vendorType === 'STUDIO') {
      body = {
        vendorType: 'STUDIO', // 🔑 리터럴 고정
        name,
        description,
        basePrice,
        durationInMinutes: duration,
        productImages: images,
        ...studio,
      };
    } else if (vendorType === 'DRESS') {
      body = {
        vendorType: 'DRESS', // 🔑 리터럴 고정
        name,
        description,
        basePrice,
        durationInMinutes: duration,
        productImages: images,
        ...dress,
      };
    } else {
      body = {
        vendorType: 'MAKEUP', // 🔑 리터럴 고정
        name,
        description,
        basePrice,
        durationInMinutes: duration,
        productImages: images,
        ...makeup,
      };
    }
  
    onChange(body);
  }, [name, description, basePrice, duration, images, hall, studio, dress, makeup, vendorType, onChange]);
  return (
    <div className="grid gap-3 mt-4">
      <TextField label="상품명" value={name} onChange={setName} />
      <TextField label="상품 설명" value={description} onChange={setDescription} />
      <NumberField label="가격" value={basePrice} onChange={setBasePrice} />
      <NumberField
        label="소요 시간(분)"
        value={duration}
        onChange={setDuration}
      />
      <ImageListField onChange={setImages} />

      {vendorType === 'WEDDING_HALL' && (
        <>
          <SelectField
            label="홀 스타일"
            value={hall.hallStyle}
            onChange={(v) => setHall((prev) => ({ ...prev, hallStyle: v as CreateWeddingHallProduct['hallStyle'] }))}
            options={['HOTEL', 'CONVENTION', 'HOUSE']}
          />
          <SelectField
            label="식사 타입"
            value={hall.hallMeal}
            onChange={(v) => setHall((prev) => ({ ...prev, hallMeal: v as CreateWeddingHallProduct['hallMeal'] }))}
            options={['BUFFET', 'COURSE', 'SEMI_COURSE']}
          />
          <NumberField
            label="수용 인원"
            value={hall.capacity}
            onChange={(v) => setHall((prev) => ({ ...prev, capacity: v }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hall.hasParking}
              onChange={(e) =>
                setHall((prev) => ({ ...prev, hasParking: e.target.checked }))
              }
            />
            주차 여부
          </label>
        </>
      )}

      {vendorType === 'STUDIO' && (
        <>
          <SelectField
            label="스튜디오 스타일"
            value={studio.studioStyle}
            onChange={(v) =>
              setStudio((prev) => ({
                ...prev,
                studioStyle: v as CreateStudioProduct['studioStyle'],
              }))
            }
            options={['PORTRAIT_FOCUSED', 'NATURAL', 'EMOTIONAL', 'CLASSIC', 'BLACK_AND_WHITE']}
          />
          <SelectField
            label="특수 촬영"
            value={studio.specialShot ?? ''}
            onChange={(v) =>
              setStudio((prev) => ({
                ...prev,
                specialShot: v as CreateStudioProduct['specialShot'],
              }))
            }
            options={['HANOK', 'UNDERWATER', 'WITH_PET']}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={studio.iphoneSnap ?? false}
              onChange={(e) =>
                setStudio((prev) => ({ ...prev, iphoneSnap: e.target.checked }))
              }
            />
            아이폰 스냅 여부
          </label>
        </>
      )}

      {vendorType === 'DRESS' && (
        <>
          <SelectField
            label="드레스 스타일"
            value={dress.dressStyle}
            onChange={(v) =>
              setDress((prev) => ({
                ...prev,
                dressStyle: v as CreateDressProduct['dressStyle'],
              }))
            }
            options={['MODERN', 'CLASSIC', 'DANAH', 'UNIQUE', 'HIGH_END']}
          />
          <SelectField
            label="제작 방식"
            value={dress.dressProduction}
            onChange={(v) =>
              setDress((prev) => ({
                ...prev,
                dressProduction: v as CreateDressProduct['dressProduction'],
              }))
            }
            options={['DOMESTIC', 'IMPORTED']}
          />
        </>
      )}

      {vendorType === 'MAKEUP' && (
        <>
          <SelectField
            label="메이크업 스타일"
            value={makeup.makeupStyle}
            onChange={(v) =>
              setMakeup((prev) => ({
                ...prev,
                makeupStyle: v as CreateMakeupProduct['makeupStyle'],
              }))
            }
            options={['INNOCENT', 'ROMANTIC', 'NATURAL', 'GLAM']}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={makeup.isStylistDesignationAvailable ?? false}
              onChange={(e) =>
                setMakeup((prev) => ({
                  ...prev,
                  isStylistDesignationAvailable: e.target.checked,
                }))
              }
            />
            지정 스타일리스트 가능
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={makeup.hasPrivateRoom ?? false}
              onChange={(e) =>
                setMakeup((prev) => ({ ...prev, hasPrivateRoom: e.target.checked }))
              }
            />
            개별룸 여부
          </label>
        </>
      )}
    </div>
  );
}