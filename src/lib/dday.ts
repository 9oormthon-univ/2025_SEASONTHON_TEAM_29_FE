// src/lib/dday.ts
/** "YYYY-MM-DD" → D-day 숫자 (오늘=0, 과거는 +, 미래는 -가 아닌 'D-n' 관례에 맞춰 음수 없이 반환하려면 옵션 사용) */
export function getDDay(
  dateStr: string,
  opts?: { clampPastToZero?: boolean; tz?: string },
): number | null {
  if (!dateStr) return null;

  // 타임존 기준 '날짜 00:00'을 맞춰서 일수 차이 계산
  const target = toLocalMidnight(dateStr, opts?.tz);
  if (!target) return null;
  const today = startOfToday(opts?.tz);

  const diffMs = target.getTime() - today.getTime();
  let d = Math.floor(diffMs / 86_400_000); // 1000*60*60*24

  // 과거를 D-0으로 고정하고 싶으면
  if (opts?.clampPastToZero && d < 0) d = 0;
  return d;
}

/** D-Day 라벨 포맷터 (D-3, D-Day, D+2 등) */
export function formatDDayLabel(d: number | null): string {
  if (d == null) return '';
  if (d === 0) return 'D-Day';
  return d > 0 ? `D-${d}` : `D+${Math.abs(d)}`;
}

/** 문자열 → 현지 자정 Date (YYYY-MM-DD 안전 처리) */
function toLocalMidnight(ymd: string, tz?: string): Date | null {
  // 안전 파싱: "YYYY-MM-DD"
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const [_, y, mo, d] = m;
  if (tz) {
    const iso = `${y}-${mo}-${d}T00:00:00`;
    return new Date(iso);
  }
  return new Date(Number(y), Number(mo) - 1, Number(d)); // 로컬 자정
}

function startOfToday(tz?: string): Date {
  const now = new Date();
  if (!tz) return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const y = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    year: 'numeric',
  }).format(now);
  const m = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    month: 'numeric',
  }).format(now);
  const d = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    day: 'numeric',
  }).format(now);
  return new Date(Number(y), Number(m) - 1, Number(d));
}
