//src/components/search/PriceRange.tsx
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import './range.css';

const MARKS = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800,
  900, 1000,
];

const THUMB = 28; // 손잡이 지름(px)

type Props = {
  value: number; // 표시할 값(미선택이면 10 전달)
  onChange: (v: number) => void;
  selected?: boolean; // ✅ 미선택/선택 상태
  onFirstPick?: () => void; // (선택) 최초 상호작용 콜백
};

export default function PriceRange({
  value,
  onChange,
  selected = false,
  onFirstPick,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const index = useMemo(() => {
    let best = 0,
      dmin = Infinity;
    MARKS.forEach((m, i) => {
      const d = Math.abs(m - value);
      if (d < dmin) {
        dmin = d;
        best = i;
      }
    });
    return best;
  }, [value]);

  const fraction = index / (MARKS.length - 1);
  const pct = selected ? fraction * 100 : 0; // ✅ 미선택이면 채움 0%

  // 말풍선: 선택된 이후만 보이도록
  const [bubbleShown, setBubbleShown] = useState(false);
  useEffect(() => {
    if (selected) setBubbleShown(true);
  }, [selected]);

  // 말풍선 위치(px)를 계산해서 CSS 변수로 내려줌
  const [bubbleLeft, setBubbleLeft] = useState<string>('0px');
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth; // 트랙 전체 폭
      const usable = Math.max(0, w - THUMB); // 손잡이 이동 가능한 폭
      const px = THUMB / 2 + usable * fraction;
      // 가장자리 살짝 클램프
      const clamped = Math.min(w - THUMB / 2, Math.max(THUMB / 2, px));
      setBubbleLeft(`${clamped}px`);
    };

    compute();
    // 리사이즈/폰 회전 시 재계산
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fraction]);

  type SliderVars = React.CSSProperties & {
    ['--pct']?: string;
    ['--bubble-left']?: string;
  };

  const styleVars: SliderVars = {
    '--pct': `${pct}%`,
    '--bubble-left': bubbleLeft,
  };

  return (
    <section className="">
      <h3 className="mb-3 text-[15px] font-extrabold text-gray-800">가격</h3>

      <div className={`px-1 ${bubbleShown ? 'pt-6' : ''}`}>
        <div className="relative" style={styleVars}>
          {/* 말풍선 (처음 상호작용 전엔 숨김, 이후엔 계속 표시) */}
          <div
            className={`pointer-events-none absolute -top-8 flex -translate-x-1/2 transform flex-col items-center transition-opacity ${
              bubbleShown ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ left: 'var(--bubble-left)' }}
          >
            <div className="rounded bg-primary-500 px-2 py-1 text-xs font-medium text-white shadow-sm whitespace-nowrap">
              {MARKS[index]}만원
            </div>
            <div
              className="h-0 w-0"
              style={{
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '6px solid #FF9B9D',
              }}
            />
          </div>

          {/* 균등 19칸 슬라이더 */}
          <input
            ref={inputRef}
            type="range"
            min={0}
            max={MARKS.length - 1}
            step={1}
            value={index}
            onChange={(e) => {
              const v = MARKS[Number(e.target.value)];
              if (!selected) onFirstPick?.(); // 값이 바뀔 때도 최초 선택 처리
              onChange(v);
            }}
            onMouseDown={() => {
              setBubbleShown(true);
              if (!selected) onFirstPick?.(); // ✅ 값이 안 변해도 최초 선택 처리
            }}
            onTouchStart={() => {
              setBubbleShown(true);
              if (!selected) onFirstPick?.(); // ✅ 터치 시작 시에도 처리
            }}
            className="custom-range w-full"
            aria-label="가격 범위"
          />
        </div>

        {/* 눈금 라벨: 10 / 100 / 1000 (100은 정확히 중앙) */}
        <div className="relative h-4 text-[11px] text-gray-400">
          <span className="absolute left-0">10만원</span>
          <span className="absolute left-1/2 -translate-x-1/2">100만원</span>
          <span className="absolute right-0 whitespace-nowrap">1000만원</span>
        </div>
      </div>
    </section>
  );
}
