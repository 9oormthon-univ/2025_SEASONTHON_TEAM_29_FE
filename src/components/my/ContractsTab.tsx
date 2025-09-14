// src/components/my/ContractsTab.tsx
'use client';

import type { ContractGroup } from '@/types/contract';
import Image from 'next/image';

export default function ContractsTab({
  groups,
  loading,
  error,
}: {
  groups: ContractGroup[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <p className="text-sm text-text-secondary">불러오는 중…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!groups.length) return <p className="text-sm text-text-secondary">계약 내역이 없어요.</p>;

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.executionDate}>
          {/* 날짜 헤더 */}
          <h3 className="mb-2 text-base font-semibold text-text--default">
            {group.executionDate}
          </h3>

          <ul className="flex flex-col gap-3">
            {group.contracts.map((c) => (
              <li key={c.contractId} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                <Image
                  src={c.logoImageUrl}
                  alt={c.vendorName}
                  className="w-12 h-12 rounded-md object-cover"
                  unoptimized
                />
                <div className="flex-1">
                  <p className="font-medium">{c.vendorName}</p>
                  <p className="text-sm text-text-secondary">{c.productName}</p>
                  <p className="text-xs text-text-tertiary">{c.regionName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}