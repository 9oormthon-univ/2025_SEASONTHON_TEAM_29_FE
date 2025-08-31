// src/lib/pwa.ts
export function isStandalonePWA() {
  // iOS Safari 전용 플래그
  // @ts-expect-error
  const iOSStandalone = typeof navigator !== 'undefined' && navigator.standalone;
  // 표준 (크로스 플랫폼)
  const displayModeStandalone =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(display-mode: standalone)').matches;

  return !!(iOSStandalone || displayModeStandalone);
}