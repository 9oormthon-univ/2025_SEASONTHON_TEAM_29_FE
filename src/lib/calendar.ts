import { StickerKey } from "@/components/calendar/stickers";
import { CalendarEventDto, EventItem } from "@/types/calendar";

export function ymKey(y: number, m: number) { return `${y}-${String(m).padStart(2,'0')}`; }

export function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
export function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth()+1, 0); }

export function addMonths(d: Date, mm: number) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + mm);
  return nd;
}

export function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

export function daysMatrix5(base: Date): Date[] {
  // base의 달 1일
  const y = base.getFullYear();
  const m = base.getMonth();
  const first = new Date(y, m, 1);

  // 달력 시작(해당 달 1일이 포함된 주의 일요일)
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay()); // 0=Sun

  // 총 35칸(5줄)
  const out: Date[] = [];
  for (let i = 0; i < 35; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d);
  }
  return out;
}

export function dday(fromYmd: string) {
  const today = new Date();
  const tgt = new Date(fromYmd + 'T00:00:00');
  const ms = Math.ceil((tgt.getTime() - new Date(today.toDateString()).getTime())/86400000);
  return ms; // 남은 날, 과거면 음수
}

export const CAT_TO_STICKER: Record<string, StickerKey> = {
  INVITATION: 'INVITATION',
  STUDIO: 'STUDIO',
  WEDDING_HALL: 'WEDDING_HALL',
  DRESS: 'DRESS',
  PARTY: 'PARTY',
  BRIDAL_SHOWER: 'BRIDAL_SHOWER',
  MAKEUP: 'MAKEUP',
};

export function dateRangeYMD(startISO: string, endISO: string): string[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const out: string[] = [];
  for (let d = s; d <= e; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    out.push(toYMD(d));
  }
  return out;
}

export function mapCategoryToSticker(cat: string): StickerKey {
  return CAT_TO_STICKER[cat] ?? 'letter';
}

export type SheetEntry = {
  id: string;
  title: string;
  sticker: StickerKey;
};

export function buildDateMaps(
  evts: CalendarEventDto[],
): {
  grid: Map<string, EventItem[]>;
  sheet: Map<string, SheetEntry[]>;
} {
  const grid = new Map<string, EventItem[]>();
  const sheet = new Map<string, SheetEntry[]>();

  for (const e of evts) {
    const sticker: StickerKey = mapCategoryToSticker(e.eventCategory);
    const days = dateRangeYMD(e.startDateTime, e.endDateTime);

    for (const ymd of days) {
      // ✅ grid에도 title 포함
      const g = grid.get(ymd) ?? [];
      g.push({ id: String(e.id), date: ymd, title: e.title, sticker });
      grid.set(ymd, g);

      const s = sheet.get(ymd) ?? [];
      s.push({ id: String(e.id), title: e.title, sticker });
      sheet.set(ymd, s);
    }
  }

  return { grid, sheet };
}