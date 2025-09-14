'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SvgObject from './SvgObject';

type Props = {
  placeholder?: string;
  showCart?: boolean;
  showTag?: boolean;
};

export default function SearchBar({
  placeholder = '검색어를 입력해 주세요',
  showCart = false,
  showTag = false,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center py-5 gap-[10px]">
      <div className="flex flex-1 min-w-0">
        <button
          onClick={() => router.push('/search')}
          className="flex h-11 flex-1 min-w-0 items-center rounded-full bg-gray-100 px-[19px] text-left"
        >
          <span className="flex-1 truncate text-[15px] text-gray-500">
            {placeholder}
          </span>
          <Search className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {showTag && (
        <button
          aria-label="태그"
          className="grid size-10 place-items-center rounded-full active:scale-95"
          onClick={() => router.push('/tags')}
        >
          <SvgObject src="/tag.svg" alt="태그" width={30} height={30} />
        </button>
      )}

      {showCart && (
        <button
          aria-label="장바구니"
          className="grid size-10 place-items-center rounded-full active:scale-95"
          onClick={() => router.push('/cart')}
        >
          <SvgObject
            src="/icons/Cart.svg"
            alt="장바구니"
            width={35}
            height={29}
          />
        </button>
      )}
    </div>
  );
}
