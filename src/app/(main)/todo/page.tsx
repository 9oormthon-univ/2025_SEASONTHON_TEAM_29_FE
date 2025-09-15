'use client';

import HeartRain, { type HeartRainHandle } from '@/components/anim/HeartRain';
import Header from '@/components/common/monocules/Header';
import { getTodoList, toggleTodo } from '@/services/todo.api';
import type { TodoItemApi } from '@/types/todo';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const TABBAR_H = 75;
const HANDLE_H = 15;
const SHEET_OPEN = 280;
const CLOSED_OFFSET = SHEET_OPEN - HANDLE_H;

export default function TodoPage() {
  const router = useRouter();
  const heartsRef = useRef<HeartRainHandle>(null);

  const [todos, setTodos] = useState<TodoItemApi[]>([]);
  const [loaded, setLoaded] = useState(false);

  // ✅ 최초 로딩
  useEffect(() => {
    (async () => {
      const data = await getTodoList();
      setTodos(data.todoItems);
      setLoaded(true);
    })();
  }, []);

  // ✅ 로딩 후 초기 하트 떨어뜨리기
  useEffect(() => {
    if (loaded) {
      const count = todos.filter((t) => t.isCompleted).length;
      heartsRef.current?.dropInitial(count);
    }
  }, [loaded]); // todos는 의존성 제거 → 매번 초기화 방지

  // ✅ 헤더 높이 기반으로 하트 레이어 높이 계산
  const headerRef = useRef<HTMLElement>(null);
  const [heartHeight, setHeartHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const calc = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const headerH = headerRef.current?.offsetHeight ?? 0;
      setHeartHeight(Math.max(0, vh - headerH - TABBAR_H - HANDLE_H));
    };
    calc();
    window.visualViewport?.addEventListener('resize', calc);
    window.addEventListener('resize', calc);
    return () => {
      window.visualViewport?.removeEventListener('resize', calc);
      window.removeEventListener('resize', calc);
    };
  }, []);

  // ✅ 시트 열고닫기 (애니메이션)
  const y = useMotionValue(CLOSED_OFFSET);
  const toggleSheet = () => {
    const target = y.get() === 0 ? CLOSED_OFFSET : 0;
    animate(y, target, { type: 'spring', stiffness: 130, damping: 20 });
  };

  // ✅ 시트 열림 정도에 따라 bottomOffset 동적 계산
  const [bottomOffset, setBottomOffset] = useState(0);
  useEffect(() => {
    const unsub = y.on('change', (val) => {
      const sheetVisible = SHEET_OPEN - val;
      setBottomOffset(sheetVisible);
    });
    return () => unsub();
  }, [y]);

  // ✅ 칩 토글 (낙관적 업데이트 + 하트 제어)
  const onToggleChip = async (templateId: number) => {
    const before = todos.find((t) => t.templateId === templateId)?.isCompleted ?? false;

    setTodos((prev) =>
      prev.map((t) => (t.templateId === templateId ? { ...t, isCompleted: !t.isCompleted } : t)),
    );
    if (!before) heartsRef.current?.dropOne();
    else heartsRef.current?.removeOne();

    try {
      await toggleTodo(templateId);
    } catch {
      // 실패 롤백
      setTodos((prev) =>
        prev.map((t) => (t.templateId === templateId ? { ...t, isCompleted: before } : t)),
      );
      if (before) heartsRef.current?.dropOne();
      else heartsRef.current?.removeOne();
    }
  };

  return (
    <main className="relative min-h-screen w-full max-w-[420px] mx-auto bg-[#191919]">
      <Header
        ref={headerRef}
        value="TO-DO"
        showBack
        onBack={() => router.back()}
        bgClassName="bg-[#191919]"
        textClassName="text-white"
      />

      {/* ✅ 하트 레이어 */}
      {heartHeight !== null && heartHeight > 0 && (
        <div
          className="fixed left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-[420px] z-[60]"
          style={{ top: headerRef.current?.offsetHeight ?? 0, height: heartHeight }}
        >
          <div className="absolute inset-0 px-[22px] py-6 z-0">
            <p className="text-2xl font-semibold whitespace-pre-line text-white/95">
              {'사랑으로\n채워주세요'}
            </p>
          </div>

          <HeartRain
            ref={heartsRef}
            height={heartHeight}
            bottomOffset={bottomOffset}
            textures={[
              '/hearts/heart-pink.png',
              '/hearts/heart-purple.png',
              '/hearts/heart-yellow.png',
            ]}
            sizeRange={[15, 70]}
            tightness={0.84}
            scaleFactor={2.35}
            gravity={1.15}
          />
        </div>
      )}

      {/* ✅ 바텀시트 */}
      <motion.div
        className="fixed left-0 right-0"
        style={{ bottom: TABBAR_H, y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: CLOSED_OFFSET }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          const next = info.velocity.y < -200 || y.get() < CLOSED_OFFSET / 2 ? 0 : CLOSED_OFFSET;
          animate(y, next, { type: 'spring', stiffness: 100, damping: 30 });
        }}
      >
        <div
          className="mx-auto w-full max-w-[420px] rounded-t-2xl bg-white text-black shadow-2xl overflow-hidden"
          style={{ height: SHEET_OPEN }}
        >
          <button
            type="button"
            onClick={toggleSheet}
            className="w-full flex items-center justify-center"
            style={{ height: HANDLE_H }}
            aria-label="시트 열기/닫기"
          >
            <div className="h-1.5 w-14 rounded-full bg-neutral-300" />
          </button>

          <div className="px-4 pt-3 pb-6 overflow-y-auto" style={{ height: SHEET_OPEN - HANDLE_H }}>
            <p className="font-semibold text-neutral-700 mb-3">수행한 항목을 선택해 주세요.</p>
            {!loaded ? (
              <p className="text-sm text-neutral-500">불러오는 중…</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {todos.map((t) => (
                  <li key={t.templateId}>
                    <label
                      className={[
                        'inline-flex items-center rounded-full border px-3 py-1.5 cursor-pointer select-none',
                        t.isCompleted
                          ? 'border-rose-300 bg-rose-50 text-rose-600'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-800',
                      ].join(' ')}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={t.isCompleted}
                        onChange={() => onToggleChip(t.templateId)}
                      />
                      <span className="text-[11px]">{t.content}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}