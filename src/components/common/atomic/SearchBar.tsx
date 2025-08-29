'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="flex items-center gap-3 px-4 pt-3">
      <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-gray-100 px-4">
        <input
          placeholder="스타일플로어 메이크업"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-gray-400"
        />
        <Search className="h-5 w-5 text-gray-500" />
      </div>

      <button aria-label="cart" className="h-11 w-11">
        <Image
          src="/icons/Cart.svg"
          alt=""
          width={24}
          height={24}
          className="h-7 w-8 select-none"
        />
      </button>
    </div>
  );
}
