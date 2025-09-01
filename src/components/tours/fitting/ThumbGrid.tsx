// components/tours/fitting/ThumbGrid.tsx
'use client';

import Image from "next/image";

type Item = { id: string; name: string; thumb: string; overlay: string };

type Props<T extends Item> = {
  items: T[];
  selectedId?: string;
  onSelect: (item: T) => void;
};

export default function ThumbGrid<T extends Item>({
  items,
  selectedId,
  onSelect,
}: Props<T>) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-1">
      {items.map((it) => {
        const on = selectedId === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it)}
            className={[
              "shrink-0 aspect-square w-18 rounded-xl p-2",
              on
                ? "bg-primary-300 ring-2 ring-red-300"
                : "bg-red-100",
            ].join(" ")}
          >
            <Image
              src={it.thumb}
              alt={it.name}
              width={64}
              height={64}
              className="mx-auto h-full w-auto object-contain"
            />
          </button>
        );
      })}
    </div>
  );
}