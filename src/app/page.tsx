'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SplashPage() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 0.7초 후 fadeOut 시작
    const t1 = setTimeout(() => setFadeOut(true), 700);

    // fadeOut 끝나고 페이지 전환 (fadeOut 0.3s로 맞춤)
    const t2 = setTimeout(() => router.replace('/welcome'), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [router]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-primary-500">
      {/* 중앙 로고 */}
      <Image
        src="/icons/logo.svg"
        alt="웨딧"
        width={160}
        height={80}
        className={`h-20 w-auto ${fadeOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        aria-hidden
      />
      {/* 접근성용 앱 이름(시각적 숨김) */}
      <span className="sr-only">웨딧</span>
    </main>
  );
}