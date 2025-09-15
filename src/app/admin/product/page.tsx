'use client';

import CrudPanel from '@/components/admin/CrudPanel';
import DynamicProductForm from '@/components/admin/DynamicProductForm';
import JsonPreview from '@/components/admin/JsonPreview';
import VendorSearchField from '@/components/admin/VendorSearchField';
import { createProduct } from '@/services/vendor.api';
import type { CreateProductRequest, VendorCategory } from '@/types/vendor';
import { useState } from 'react';

export default function ProductAdminPage() {
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [vendorType, setVendorType] = useState<VendorCategory | null>(null);

  const [form, setForm] = useState<CreateProductRequest | null>(null);

  return (
    <div className="space-y-6">
      <CrudPanel title="상품 등록">
        {/* 1. 업체 선택 */}
        <VendorSearchField
          onSelect={(vendor) => {
            setVendorId(vendor.vendorId);
            setVendorType(vendor.vendorType);
            setForm(null); // 업체 바뀌면 폼 초기화
          }}
        />

        {/* 2. 선택된 업체 확인 */}
        {vendorId && (
          <p className="text-sm text-gray-600 mt-2">
            선택된 업체 ID: {vendorId} / 타입: {vendorType}
          </p>
        )}

        {/* 3. 동적 상품 폼 */}
        {vendorType && (
          <DynamicProductForm
            vendorType={vendorType}
            onChange={setForm}
          />
        )}

        {/* 4. 등록 버튼 */}
        {vendorId && form && (
          <button
            onClick={async () => {
              try {
                const id = await createProduct(vendorId, form);
                alert(`상품 등록 완료 (id=${id})`);
              } catch (e) {
                alert(`상품 등록 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`);
              }
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            상품 등록
          </button>
        )}

        {/* 5. 미리보기 */}
        {form && (
          <div className="mt-4">
            <JsonPreview data={form} />
          </div>
        )}
      </CrudPanel>
    </div>
  );
}