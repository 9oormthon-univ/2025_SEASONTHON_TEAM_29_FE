// src/components/common/NotificationToast.tsx
'use client';

import type { NotificationResponseDTO } from '@/types/notification';
import { formatRelativeTime } from '@/utills/time';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import SvgObject from './atomic/SvgObject';

type ToastProps = {
  notification: NotificationResponseDTO;
  onClose: () => void;
  onClick?: () => void;
};

function categoryToIcon(category: string): { src: string; bg: string } {
  if (category.includes('일정')) {
    return { src: '/icons/alert/schedule.png', bg: 'bg-blue-100' };
  }
  if (category.includes('혜택') || category.includes('마케팅') || category.includes('이벤트')) {
    return { src: '/icons/alert/event.png', bg: 'bg-yellow-100' };
  }
  if (category.includes('활동') || category.includes('소식')) {
    return { src: '/icons/alert/heart.png', bg: 'bg-pink-100' };
  }
  return { src: '', bg: 'bg-gray-100' };
}

export default function NotificationToast({
  notification,
  onClose,
  onClick,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const iconConfig = categoryToIcon(notification.category);
  const timeText = formatRelativeTime(notification.createdAt);

  useEffect(() => {
    console.log('🔔 NotificationToast 마운트됨:', notification.title);
    // 애니메이션을 위한 지연
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      console.log('🔔 NotificationToast 표시됨');
    }, 10);

    // 5초 후 자동 닫기
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 완료 후 제거
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
    };
  }, [onClose, notification.title]);

  return (
    <div
      className="w-full px-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 300ms ease-out, transform 300ms ease-out',
        willChange: 'opacity, transform',
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-start gap-3 cursor-pointer active:bg-gray-50"
        onClick={onClick}
      >
        {iconConfig.src && (
          <div
            className={`${iconConfig.bg} flex shrink-0 items-center justify-center rounded-full`}
            style={{ width: 40, height: 40 }}
          >
            <Image
              src={iconConfig.src}
              alt=""
              width={20}
              height={20}
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-default truncate">
            {notification.title}
          </p>
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {notification.content}
          </p>
          <p className="text-xs text-text-tertiary mt-1">{timeText}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
    </div>
  );
}

