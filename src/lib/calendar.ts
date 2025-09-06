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