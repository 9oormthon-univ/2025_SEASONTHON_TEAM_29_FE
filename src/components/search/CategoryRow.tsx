//src/components/search/CategoryRow.tsx
'use client';

import { categories } from '@/data/homeData';
import { CategoryKey } from '@/types/category';
import SvgObject from '../common/atomic/SvgObject';

export default function CategoryRow({
  value,
  onChange,
}: {
  value: CategoryKey | null;                  // ✅ 단일 값
  onChange: (v: CategoryKey | null) => void; // ✅ 단일 값 토글
}) {
  return (
    <div className="rounded-2xl bg-white px-3">
      <div className="relative grid grid-cols-4">
        {categories.map((c, i) => {
          const active = value === c.key;
          const hasSelection = value !== null;
          const isDim = hasSelection && !active; // 선택이 있을 때, 비활성 아이템만 흐리게

          return (
            <button
              key={c.key}
              onClick={() => onChange(active ? null : c.key)} // 토글(해제 원치 않으면 onChange(c.key))
              aria-pressed={active}
              className="relative flex flex-col items-center gap-1 py-3 text-center text-xs"
            >
              <div className="h-10 w-10">
                <SvgObject
                  src={c.icon}
                  alt={c.label}
                  className={['h-full w-full transition', isDim ? 'grayscale opacity-60' : ''].join(' ')}
                />
              </div>

              <span
                className={[
                  'mt-1 transition-colors',
                  active
                    ? 'text-primary-500 font-medium'
                    : isDim
                      ? 'text-gray-400' // 선택된 게 있을 때 비활성은 연한 회색
                      : 'text-gray-700', // 선택 없을 땐 기본
                ].join(' ')}
              >
                {c.label}
              </span>

              {i !== categories.length - 1 && (
                <span className="absolute right-0 top-1/2 h-8 -translate-y-1/2 border-r border-gray-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}