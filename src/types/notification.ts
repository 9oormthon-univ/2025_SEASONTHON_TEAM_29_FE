// src/types/notification.ts

export type NotificationCategory = '일정' | '활동소식' | '혜택/마케팅' | '전체';

export type TargetDomainType =
  | 'RESERVATION'
  | 'CONTRACT'
  | 'CALENDAR'
  | 'REVIEW'
  | 'NOTICE'
  | 'PROMOTION'
  | 'MY_PAGE'
  | 'INVITATION'
  | 'MAIN'
  | 'NONE';

export type NotificationResponseDTO = {
  id: number;
  category: string;
  title: string;
  content: string;
  targetDomainType: TargetDomainType;
  targetDomainId: number;
  isRead: boolean;
  createdAt: string; // ISO 8601 format
};

export type NotificationPageResponse = {
  totalElements: number;
  totalPages: number;
  size: number;
  content: NotificationResponseDTO[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type UnreadCountResponse = {
  unreadCount: number;
};



