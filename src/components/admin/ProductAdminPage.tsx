'use client';

import { createProduct } from '@/services/vendor.api';
import type { CreateProductRequest, VendorDetail } from '@/types/vendor';
import { useState } from 'react';
import CrudPanel from './CrudPanel';
import DynamicProductForm from './DynamicProductForm';
import ImageListField, { ProductImage } from './ImageListField';
import JsonPreview from './JsonPreview';
import VendorSearchField from './VendorSearchField';

export default function ProductAdminPage() {
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [body, setBody] = useState<CreateProductRequest | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);

  return (
    <div className="space-y-6">
      {/* 업체 검색/선택 */}
      <CrudPanel title="업체 선택">
        <VendorSearchField onSelect={(v) => setVendor(v)} />
      </CrudPanel>

      {/* 상품 생성 */}
      <CrudPanel
        title="상품 생성"
        actions={[
          {
            label: '생성',
            onClick: async () => {
              if (!vendor || !body) return alert('업체와 상품 내용을 입력하세요');
              const req: CreateProductRequest = { ...body, productImages: images };
              await createProduct(vendor.vendorId, req);
              alert('상품 등록 완료');
            },
          },
        ]}
      >
        {vendor && (
          <>
            <DynamicProductForm
              vendorType={vendor.vendorType}
              onChange={setBody}
            />
            <ImageListField domain="PRODUCT" onChange={setImages} />
          </>
        )}
        <JsonPreview data={{ vendor, body, images }} />
      </CrudPanel>
    </div>
  );
}