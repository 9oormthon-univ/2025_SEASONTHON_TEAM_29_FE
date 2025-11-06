// src/services/notification.api.ts
import { http, type ApiEnvelope } from '@/services/http';
import type {
  NotificationCategory,
  NotificationPageResponse,
  UnreadCountResponse,
} from '@/types/notification';

const BASE = '/v1/notifications';

/** 알림 목록 조회 */
export async function getNotifications(params: {
  page?: number;
  size?: number;
  category?: NotificationCategory;
}): Promise<NotificationPageResponse> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) {
    searchParams.append('page', String(params.page));
  }
  if (params.size !== undefined) {
    searchParams.append('size', String(params.size));
  }
  if (params.category && params.category !== '전체') {
    searchParams.append('category', params.category);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `${BASE}?${queryString}` : BASE;

  const res = await http<ApiEnvelope<NotificationPageResponse>>(url, {
    method: 'GET',
  });

  if (!res.data) {
    throw new Error('알림 목록을 불러오지 못했습니다.');
  }

  return res.data;
}

/** 안 읽은 알림 개수 조회 */
export async function getUnreadCount(): Promise<number> {
  const res = await http<ApiEnvelope<UnreadCountResponse>>(
    `${BASE}/unread-count`,
    {
      method: 'GET',
    },
  );

  if (!res.data) {
    return 0;
  }

  return res.data.unreadCount;
}

/** 알림 읽음 처리 */
export async function markNotificationAsRead(
  notificationId: number,
): Promise<void> {
  await http<ApiEnvelope<string>>(`${BASE}/${notificationId}/read`, {
    method: 'PATCH',
  });
}

/** FCM 디바이스 토큰 등록 */
export async function registerFCMToken(fcmToken: string): Promise<void> {
  await http<ApiEnvelope<string>>('/v1/member/device', {
    method: 'POST',
    body: JSON.stringify({ fcmToken }),
  });
}



