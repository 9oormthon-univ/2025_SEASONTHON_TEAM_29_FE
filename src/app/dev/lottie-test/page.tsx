// src/app/dev/lottie-test/page.tsx
'use client';

import congrats from '@/assets/animations/congrats.json';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { useRef, useState } from 'react';

export default function Page() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [plays, setPlays] = useState(0);
  const [done, setDone] = useState(false);

  const onComplete = () => {
    setPlays((prev) => {
      const next = prev + 1;
      if (next < 2) {
        // 2회 전이면 처음부터 다시 재생
        lottieRef.current?.goToAndPlay(0, true);
      } else {
        setDone(true);
      }
      return next;
    });
  };

  const restartTwoLoops = () => {
    setDone(false);
    setPlays(0);
    lottieRef.current?.stop();
    lottieRef.current?.goToAndPlay(0, true);
  };

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="flex flex-col items-center gap-4">
        <Lottie
          lottieRef={lottieRef}
          animationData={congrats}
          loop={false}      // 꼭 false
          autoplay
          onComplete={onComplete}
          style={{ width: 180, height: 180 }}
          className="w-[180px] h-[180px]"
        />
        <div className="text-sm text-gray-600">
          plays: {plays}/2 {done && '✅ 완료'}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-black text-white" onClick={restartTwoLoops}>
            2회 재생 테스트
          </button>
          <button className="px-3 py-2 rounded border" onClick={() => lottieRef.current?.pause()}>
            일시정지
          </button>
          <button className="px-3 py-2 rounded border" onClick={() => lottieRef.current?.play()}>
            재생
          </button>
        </div>
      </div>
    </main>
  );
}