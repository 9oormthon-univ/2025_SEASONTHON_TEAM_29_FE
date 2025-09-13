// components/admin/ImageListField.tsx
'use client';

import type { UploadDomain } from '@/types/media';
import { useState } from 'react';
import UploadField from './UploadField';

export type ProductImage = {   // <-- export 추가
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

  return (
    <div className="border rounded p-2 space-y-2">
      <div className="font-medium text-sm">상품 이미지 업로드</div>

      <UploadField label="이미지 추가" domain={domain} onDone={addImage} />

      {images.length > 0 && (
        <ul className="space-y-1">
          {images.map((img, idx) => (
            <li
              key={img.mediaKey}
              className="flex items-center justify-between text-xs bg-gray-50 p-1 rounded"
            >
              <span className="truncate flex-1">
                {img.sortOrder}. {img.mediaKey}
              </span>
              <button
                className="ml-2 px-2 py-0.5 bg-red-500 text-white rounded text-xs"
                onClick={() => removeImage(idx)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}