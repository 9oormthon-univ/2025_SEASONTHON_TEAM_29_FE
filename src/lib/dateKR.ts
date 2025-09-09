// src/lib/dateKR.ts
export function todayYMDSeoul(): string {
  const now = new Date();
  const y = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric' }).format(now);
  const m = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', month: '2-digit' }).format(now);
  const d = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', day: '2-digit' }).format(now);
  return `${y}-${m}-${d}`;
}

export function isPastYMDSeoul(ymd: string): boolean {
  const today = todayYMDSeoul();
  return /^\d{4}-\d{2}-\d{2}$/.test(ymd) ? ymd < today : false;
}