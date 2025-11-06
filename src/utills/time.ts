// utils/time.ts
export function formatTimeHM(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** ISO 8601 날짜 문자열을 상대 시간으로 포맷팅 (예: "37분 전", "1시간 전", "10.27") */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 오늘인 경우
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const notificationDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (notificationDate.getTime() === today.getTime()) {
    // 오늘: 상대 시간 표시
    if (diffMinutes < 1) {
      return '방금 전';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
  }

  // 지난 알림: 날짜 표시 (MM.DD 형식)
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}.${day}`;
}