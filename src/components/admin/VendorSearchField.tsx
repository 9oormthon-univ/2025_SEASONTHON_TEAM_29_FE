'use client';

import { getVendorDetail } from '@/services/vendor.api';
import type { VendorDetail } from '@/types/vendor';
import { useState } from 'react';

export default function VendorSearchField({
  onSelect,
}: {
  onSelect: (vendor: VendorDetail) => void;
}) {
  const [id, setId] = useState('');
  const [selected, setSelected] = useState<VendorDetail | null>(null);

  const fetchById = async () => {
    const numId = Number(id);
    if (!numId) return alert('유효한 ID를 입력하세요');
    try {
      const detail = await getVendorDetail(numId);
      setSelected(detail);
      onSelect(detail);
    } catch (e) {
      console.log(e);
      alert('업체를 찾을 수 없습니다.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="업체 ID 입력"
          className="border px-2 py-1 flex-1"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={fetchById}
        >
          조회
        </button>
      </div>

      {selected && (
        <div className="text-xs text-gray-600">
          선택됨: {selected.vendorName} ({selected.vendorType})
        </div>
      )}
    </div>
  );
}