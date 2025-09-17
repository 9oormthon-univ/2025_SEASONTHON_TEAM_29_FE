'use client';

import congrats from '@/assets/animations/congrats.json';
import Header from '@/components/common/monocules/Header';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';

export default function FinishPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Header value="계약완료" onBack={() => router.push('/home')} />

      <main className="flex-1 mx-auto w-full max-w-[420px] px-[22px] flex flex-col items-center justify-center gap-6">
        <Lottie
          animationData={congrats}
          loop={false}           // 필요하면 true
          autoplay
          style={{ width: 157, height: 181 }}
          className="w-[157px] h-[181px] select-none pointer-events-none"
        />
        <h1 className="text-[22px] font-extrabold text-text--default">
          계약이 완료 되었어요!
        </h1>
      </main>
    </div>
  );
}
