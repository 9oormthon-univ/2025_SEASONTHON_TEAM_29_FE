'use client';

import SvgObject from '@/components/common/atomic/SvgObject';
import Header from '@/components/common/monocules/Header';
import { useNotifications } from '@/hooks/useNotifications';
import { markNotificationAsRead } from '@/services/notification.api';
import type { NotificationCategory, NotificationResponseDTO } from '@/types/notification';
import { formatRelativeTime } from '@/utills/time';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type NotificationTab = 'all' | 'benefit' | 'schedule' | 'activity';

// 탭을 API 카테고리로 매핑
function tabToCategory(tab: NotificationTab): NotificationCategory {
  switch (tab) {
    case 'schedule':
      return '일정';
    case 'activity':
      return '활동소식';
    case 'benefit':
      return '혜택/마케팅';
    default:
      return '전체';
  }
}

// API 카테고리를 아이콘 타입으로 매핑
function categoryToIcon(category: string): 'calendar' | 'gift' | 'heart' | 'default' {
  if (category.includes('일정')) return 'calendar';
  if (category.includes('혜택') || category.includes('마케팅') || category.includes('이벤트'))
    return 'gift';
  if (category.includes('활동') || category.includes('소식')) return 'heart';
  return 'default';
}

// 알림을 오늘/지난으로 분리
function separateNotifications(
  notifications: NotificationResponseDTO[],
): {
  today: NotificationResponseDTO[];
  past: NotificationResponseDTO[];
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayList: NotificationResponseDTO[] = [];
  const pastList: NotificationResponseDTO[] = [];

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.createdAt);
    notifDate.setHours(0, 0, 0, 0);

    if (notifDate.getTime() === today.getTime()) {
      todayList.push(notif);
    } else {
      pastList.push(notif);
    }
  });

  return { today: todayList, past: pastList };
}

function NotificationTabs({
  value,
  onChange,
}: {
  value: NotificationTab;
  onChange: (tab: NotificationTab) => void;
}) {
  const tabs: { key: NotificationTab; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'benefit', label: '혜택/이벤트' },
    { key: 'schedule', label: '일정' },
    { key: 'activity', label: '활동/소식' },
  ];

  return (
    <div className="flex border-b border-gray-100">
      {tabs.map((tab) => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex-1 py-3 text-sm font-medium ${
              isActive
                ? 'text-text-default border-b-2 border-primary-500'
                : 'text-text-secondary'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function NotificationIcon({ icon }: { icon: 'calendar' | 'gift' | 'heart' | 'default' }) {
  const iconConfig = {
    calendar: {
      bg: 'bg-blue-100',
      src: '/icons/alert/schedule.png',
      size: 40,
      iconSize: 24,
    },
    gift: {
      bg: 'bg-yellow-100',
      src: '/icons/alert/event.png',
      size: 40,
      iconSize: 20,
    },
    heart: {
      bg: 'bg-pink-100',
      src: '/icons/alert/heart.png',
      size: 40,
      iconSize: 20,
    },
    default: {
      bg: 'bg-gray-100',
      src: '',
      size: 40,
      iconSize: 0,
    },
  };

  const config = iconConfig[icon];
  const isPng = config.src?.endsWith('.png');

  return (
    <div
      className={`${config.bg} flex shrink-0 items-center justify-center rounded-full`}
      style={{ width: config.size, height: config.size }}
    >
      {config.src && config.iconSize > 0 && (
        <>
          {isPng ? (
            <Image
              src={config.src}
              alt=""
              width={config.iconSize}
              height={config.iconSize}
              className="object-contain"
              unoptimized
            />
          ) : (
            <SvgObject
              src={config.src}
              alt=""
              width={config.iconSize}
              height={config.iconSize}
            />
          )}
        </>
      )}
    </div>
  );
}

function NotificationItemComponent({
  item,
  onClick,
}: {
  item: NotificationResponseDTO;
  onClick?: () => void;
}) {
  const icon = categoryToIcon(item.category);
  const timeText = formatRelativeTime(item.createdAt);

  const handleClick = async () => {
    if (!item.isRead) {
      try {
        await markNotificationAsRead(item.id);
      } catch (error) {
        console.error('알림 읽음 처리 실패:', error);
      }
    }
    onClick?.();
  };

  return (
    <li
      className="relative flex items-start gap-3 px-[22px] py-4 active:bg-gray-50 cursor-pointer"
      onClick={handleClick}
    >
      <NotificationIcon icon={icon} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${item.isRead ? 'text-text-default' : 'text-text-default font-medium'}`}>
          {item.title}
        </p>
        <p className="mt-1 text-sm text-text-default">{item.content}</p>
      </div>
      <div className="shrink-0">
        <p className="text-xs text-text-secondary whitespace-nowrap">
          {timeText}
        </p>
      </div>
      <div className="absolute bottom-0 left-[22px] right-[22px] h-px bg-gray-100" />
    </li>
  );
}

export default function NotificationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const category = tabToCategory(activeTab);

  const { items, loading, error, hasMore, loadMore } = useNotifications(category);

  // 알림을 오늘/지난으로 분리
  const { today, past } = useMemo(() => separateNotifications(items), [items]);

  const handleTabChange = (tab: NotificationTab) => {
    setActiveTab(tab);
  };

  return (
    <main className="w-full max-w-[420px] mx-auto bg-white min-h-screen">
      <Header showBack onBack={() => router.push('/home')} value="알림" />
      <NotificationTabs value={activeTab} onChange={handleTabChange} />

      <div className="pb-24">
        {loading && items.length === 0 && (
          <div className="px-[22px] py-16 text-center">
            <p className="text-sm text-text-secondary">불러오는 중…</p>
          </div>
        )}

        {error && items.length === 0 && (
          <div className="px-[22px] py-16 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {today.length > 0 && (
              <section className="mt-6">
                <h2 className="px-[22px] text-base font-semibold text-text-default mb-3">
                  오늘 받은 알림
                </h2>
                <ul>
                  {today.map((item) => (
                    <NotificationItemComponent key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            )}

            {past.length > 0 && (
              <section className="mt-8">
                <h2 className="px-[22px] text-base font-semibold text-text-default mb-3">
                  지난 알림
                </h2>
                <ul>
                  {past.map((item) => (
                    <NotificationItemComponent key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            )}

            {today.length === 0 && past.length === 0 && (
              <div className="px-[22px] py-16 text-center">
                <p className="text-sm text-text-secondary">
                  {activeTab === 'all'
                    ? '알림이 없습니다.'
                    : '해당 카테고리의 알림이 없습니다.'}
                </p>
              </div>
            )}

            {hasMore && (
              <div className="px-[22px] py-4 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loading}
                  className="text-sm text-text-secondary hover:text-text-default disabled:opacity-50"
                >
                  {loading ? '불러오는 중…' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

