export function formatMoney(n: number) {
  return n.toLocaleString('ko-KR') + '원';
}
const KOR_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
export function formatSlot(iso: string) {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${yy}.${mm}.${dd} ${week}요일 ${hh}:${mi}`;
}

export function formatKoreanSlotDate(iso: string) {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const dow = KOR_WEEK[d.getDay()];
  return `${yy}.${mm}.${dd} ${dow}요일 ${hh}:${mi}`;
}
