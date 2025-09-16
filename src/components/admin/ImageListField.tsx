// components/admin/ImageListField.tsx
'use client';

import type { UploadDomain } from '@/types/media';
import Image from 'next/image';
import { useState } from 'react';
import UploadField from './UploadField';

export type ProductImage = {
  mediaKey: string;
  contentType: string;
  sortOrder: number;
};

export default function ImageListField({
  domain = 'PRODUCT',
  onChange,
}: {
  domain?: UploadDomain;
  onChange: (images: ProductImage[]) => void;
}) {
  const [images, setImages] = useState<ProductImage[]>([]);

  const addImage = (img: { mediaKey: string; contentType: string }) => {
    const next: ProductImage = {
      ...img,
      sortOrder: images.length + 1,
    };
    const updated = [...images, next];
    setImages(updated);
    onChange(updated);
  };

  const removeImage = (idx: number) => {
    const updated = images
      .filter((_, i) => i !== idx)
      .map((it, i) => ({ ...it, sortOrder: i + 1 }));
    setImages(updated);
    onChange(updated);
  };

  // ✅ mediaKey → URL 변환 (백엔드 정책에 맞게 수정 필요)
  const toUrl = (mediaKey: string) =>
    `https://your-s3-bucket-url/${mediaKey}`;

  return (
    <div className="border rounded p-2 space-y-2">
      <div className="font-medium text-sm">상품 이미지 업로드</div>

      <UploadField label="이미지 추가" domain={domain} onDone={addImage} />

      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <li
              key={img.mediaKey}
              className="relative rounded overflow-hidden border group"
            >
              {/* ✅ 썸네일 프리뷰 */}
              <Image
                src={toUrl(img.mediaKey)}
                alt={`상품 이미지 ${idx + 1}`}
                width={200}
                height={200}
                className="object-cover w-full h-28"
                unoptimized
              />

              {/* ✅ 삭제 버튼 */}
              <button
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-80 hover:opacity-100"
                onClick={() => removeImage(idx)}
              >
                삭제
              </button>

              {/* ✅ sortOrder 표시 */}
              <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">
                {img.sortOrder}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}