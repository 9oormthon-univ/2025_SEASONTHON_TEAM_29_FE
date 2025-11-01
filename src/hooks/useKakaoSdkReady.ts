import { useEffect, useState } from 'react';

export function useKakaoSdkReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 이미 SDK가 로드된 경우
    const w = window as unknown as { kakao?: { maps?: { load?: unknown } } };
    if (w.kakao && w.kakao.maps && typeof w.kakao.maps.load === 'function') {
      setReady(true);
      return;
    }

    // 이미 같은 스크립트가 있는지 체크
    let script = document.querySelector('script[src*="dapi.kakao.com"]') as HTMLScriptElement | null;
    if (!script) {
      // 환경변수에서 API 키 읽기 (Next.js에서 window 환경에 할당 필요)
      const winEnv = window as unknown as { NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY?: string };
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || winEnv.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
      if (!apiKey) {
        console.error('카카오맵 API 키가 설정되지 않았습니다. 환경변수 NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY를 확인하세요.');
        return;
      }
      const s = document.createElement('script');
      s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
      s.async = true;
      document.head.appendChild(s);
      script = s;
    }

    // SDK 로드를 폴링
    const interval = setInterval(() => {
      if (window.kakao?.maps?.load) {
        setReady(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return ready;
}
