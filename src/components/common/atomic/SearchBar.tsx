'use client';

import { Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  placeholder?: string;
  showCart?: boolean; // ✅ cart 아이콘 표시 여부
};

export default function SearchBar({ placeholder = '검색어를 입력해 주세요', showCart = false }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 py-5">
      {/* 검색창 자체를 버튼처럼 */}
      <button
        onClick={() => router.push('/search')}
        className={`flex h-11 items-center gap-2 rounded-full bg-gray-100 px-4 text-left 
          ${showCart ? 'flex-1' : 'w-full'}`}
      >
        <span className="flex-1 text-[15px] text-gray-500">{placeholder}</span>
        <Search className="h-5 w-5 text-gray-500" />
      </button>

      <button aria-label="cart" className="h-11 w-11">
        <Image
          src="/icons/Cart.svg"
          alt=""
          width={40}
          height={40}
        />
      </button>
    </div>
  );
}
