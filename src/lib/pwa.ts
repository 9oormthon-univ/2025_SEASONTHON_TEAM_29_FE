type IOSNavigator = Navigator & { standalone?: boolean };

export function isStandalonePWA() {
  // iOS Safari 전용 비표준 속성(navigator.standalone)을 안전하게 접근
  const nav: IOSNavigator | undefined =
    typeof navigator !== 'undefined' ? (navigator as IOSNavigator) : undefined;
  const iOSStandalone = Boolean(nav?.standalone);

  // 표준 display-mode: standalone
  const displayModeStandalone =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches === true;

  return iOSStandalone || displayModeStandalone;
}