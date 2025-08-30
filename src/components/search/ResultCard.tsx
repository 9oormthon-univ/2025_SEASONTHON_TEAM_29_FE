// src/components/search/ResultCard.tsx
'use client';

export function ResultCard({
  id, name, region, cat, price,
}: { id:number; name:string; region:string; cat:string; price:number }) {
  return (
    <a href={`/vendors/${id}`} className="flex gap-3">
      <div className="h-16 w-16 overflow-hidden rounded-lg bg-gray-100" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">{name}</p>
        <p className="mt-1 text-sm text-gray-500">{region} · {cat}</p>
        <p className="mt-0.5 text-sm text-gray-700">
          ~ {new Intl.NumberFormat('ko-KR').format(price)}원
        </p>
      </div>
    </a>
  );
}