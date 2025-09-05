// src/data/calendarData.ts
import type { EventItem } from '@/types/calendar';

// 개인 일정(기존)
export type CalEvent = {
  id: string;
  date: string;
  title: string;
  sticker: 'letter' | 'studio' | 'hall' | 'dress' | 'drink' | 'cake' | 'makeup';
};

export const MOCK_WEDDING_DATE = '2026-06-01';

export const MOCK_EVENTS: CalEvent[] = [
  { id: 'e1', date: '2025-09-06', title: '성수에서 청첩장모임', sticker: 'letter' },
  { id: 'e2', date: '2025-09-17', title: '케이크 시식', sticker: 'cake' },
  { id: 'e3', date: '2025-09-21', title: '예복 픽업', sticker: 'cake' },
];

type FairRaw =
  | { id: string; title: string; city: string; type: 'single'; date: string }
  | { id: string; title: string; city: string; type: 'range'; start: string; end: string }
  | { id: string; title: string; city: string; type: 'weekends'; start?: string; end?: string }; // ✅ 기간 옵션

export const MOCK_FAIRS: FairRaw[] = [
  { id: 'f1', title: '2025 서울웨딩쇼 in 워커힐', city: '서울', type: 'single', date: '2025-09-06' },
  { id: 'f2', title: '세텍 웨딩 페어', city: '서울', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f4', title: '세텍 허니문 페어', city: '서울', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f5', title: '웨덱스 웨딩박람회 in 코엑스마곡', city: '기타', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f6', title: '노원 롯데백화점 대형 웨딩박람회', city: '기타', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f7', title: '서울 웨딩드레스 페어', city: '서울', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f8', title: '하우투 대형 웨딩박람회', city: '기타', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f9', title: '신세계백화점 본점 대형 웨딩박람회', city: '기타', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f10', title: '서울웨딩페어', city: '서울', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f11', title: '웨덱스 초대형 웨딩박람회 IN 코엑스', city: '기타', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f12', title: '청량리 롯데백화점 대형 웨딩박람회', city: '기타', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f13', title: '팜투어 직거래 허니문 박람회', city: '기타', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f14', title: '서울 웨딩홀 박람회', city: '서울', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f15', title: '서울 신혼여행 박람회', city: '서울', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f16', title: '제이웨딩페어', city: '기타', type: 'range', start: '2025-09-27', end: '2025-09-28' },
  { id: 'f17', title: '세텍 웨딩홀 페어', city: '서울', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f18', title: '서울 웨딩그라운드 웨딩박람회', city: '서울', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f19', title: '허니문 직거래 박람회', city: '기타', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f20', title: '용산 라라웨딩박람회', city: '기타', type: 'range', start: '2025-09-13', end: '2025-09-14' },
  { id: 'f21', title: '서울 세텍 웨딩박람회', city: '서울', type: 'range', start: '2025-09-20', end: '2025-09-21' },
  { id: 'f22', title: '서울 세텍 웨딩홀박람회', city: '서울', type: 'range', start: '2025-09-20', end: '2025-09-21' },
  { id: 'f23', title: '서울 세텍 허니문박람회', city: '서울', type: 'range', start: '2025-09-20', end: '2025-09-21' },
  { id: 'f24', title: '명동 롯데백화점 본점 대형 웨딩박람회', city: '기타', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f25', title: '한나 웨딩박람회', city: '기타', type: 'single', date: '2025-09-13' },
  { id: 'f26', title: '일산킨텍스 최대규모 웨딩박람회', city: '기타', type: 'range', start: '2025-09-06', end: '2025-09-07' },
  { id: 'f27', title: '수원 컨벤션 초대형 웨딩박람회', city: '경기도', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f28', title: '수원 메쎄 대형 웨딩박람회', city: '경기도', type: 'range', start: '2025-08-30', end: '2025-08-31' },
  { id: 'f29', title: '안양 롯데백화점 평촌점 웨딩박람회', city: '경기도', type: 'range', start: '2025-09-13', end: '2025-09-14' },
];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function expandFairsToDays(monthBase: Date): Array<EventItem & { title: string }> {
  const y = monthBase.getFullYear();
  const m = monthBase.getMonth();
  const monthStart = new Date(y, m, 1);
  const monthEnd   = new Date(y, m + 1, 0);

  const days: Date[] = [];
  for (let d = new Date(monthStart); d <= monthEnd; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    days.push(d);
  }
  const weekendDates = days.filter((d) => d.getDay() === 0 || d.getDay() === 6);

  const out: Array<EventItem & { title: string }> = [];

  for (const f of MOCK_FAIRS) {
    if (f.type === 'single') {
      const d = new Date(f.date);
      if (d.getFullYear() === y && d.getMonth() === m) {
        out.push({ id: f.id, date: f.date, sticker: 'hall', title: f.title });
      }
    } else if (f.type === 'range') {
      const s = new Date(f.start);
      const e = new Date(f.end);
      for (const d of days) {
        if (d >= s && d <= e) {
          out.push({ id: `${f.id}-${ymd(d)}`, date: ymd(d), sticker: 'hall', title: f.title });
        }
      }
    } else if (f.type === 'weekends') {
      // 주말 전체 생성이 과하면 주석/삭제하거나 기간 옵션을 도입해서 제한해줘
      for (const d of weekendDates) {
        out.push({ id: `${f.id}-${ymd(d)}`, date: ymd(d), sticker: 'hall', title: f.title });
      }
    }
  }
  return out;
}