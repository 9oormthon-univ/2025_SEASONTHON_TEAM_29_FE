'use client';

import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SvgObject from './SvgObject';

type Props = {
  placeholder?: string;
  showCart?: boolean;
  showTag?: boolean;
  showNotification?: boolean;
};

export default function SearchBar({
  placeholder = '검색어를 입력해 주세요',
  showCart = false,
  showNotification = false,
}: Props) {
  const router = useRouter();
  const { count: unreadCount } = useUnreadNotificationCount();

  const notificationIconSrc =
    unreadCount > 0
      ? '/icons/alert/alert_active.svg'
      : '/icons/alert/alert_disable.svg';

  return (
    <div className="flex items-center py-5 gap-[14px]">
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
      {showCart && (
        <button
          aria-label="장바구니"
          className="grid place-items-center rounded-full"
          onClick={() => router.push('/cart')}
        >
          <SvgObject
            src="/icons/Cart.svg"
            alt="장바구니"
            width={29}
            height={29}
          />
        </button>
      )}
      {showNotification && (
        <button
          aria-label="알림"
          className="grid place-items-center rounded-full"
          onClick={() => router.push('/notification')}
        >
          <SvgObject
            src={notificationIconSrc}
            alt="알림"
            width={29}
            height={29}
          />
        </button>
      )}
    </div>
  );
}
