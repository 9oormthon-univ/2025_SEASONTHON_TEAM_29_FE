// src/components/calendar/CalSheet.tsx
'use client';

import { STICKER_SRC } from '@/components/calendar/stickers';
import Link from 'next/link';
import { useEffect } from 'react';

type Mode = 'schedule' | 'event';
type SheetItem = { id: string; title: string; sticker: keyof typeof STICKER_SRC };

export default function CalSheet({
  ymd,
  items,
  mode,
  onClose,
}: {
  ymd: string | null;
  items: SheetItem[];
  mode: Mode;
  onClose: () => void;
}) {
  // ESC 닫기
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (ymd) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ymd, onClose]);

  if (!ymd) return null;

  const d = new Date(ymd);
  const weekdays = ['일','월','화','수','목','금','토'];
  const title = `${d.getMonth()+1}월 ${d.getDate()}일 ${weekdays[d.getDay()]}요일`;

  const isEvent = mode === 'event';

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <div
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[420px]
                   rounded-t-2xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+100px)]
                   shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />

        <h2 className="text-[18px] font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-[13px] text-gray-400">
          오늘은 어떤 {isEvent ? '행사가 있을까요?' : '이벤트가 있으신가요?'}
        </p>

        <div className="mt-4">
          {/* 일정 등록: 행사 모드에서는 비활성 */}
          {!isEvent && (
            <Link
              href={`/calendar/new?date=${ymd}`}
              className="flex items-center gap-2 rounded-xl
                        text-gray-400 hover:bg-gray-50 active:scale-[0.98] gap-3"
            >
              <div className="h-7 w-7 rounded border border-dashed border-gray-300" />
              <span className="text-[15px]">새로운 일정을 등록해주세요.</span>
            </Link>
          )}
        </div>

        <ul className="mt-5 space-y-3">
          {items.map((it) => (
            <li key={it.id} className="flex items-center gap-3">
              <img
                src={STICKER_SRC[it.sticker]}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
                draggable={false}
              />
              <span className="text-[15px] text-gray-700">{it.title}</span>
            </li>
          ))}
          {!items.length && (
            <p className="py-4 text-center text-sm text-gray-400">
              {isEvent ? '등록된 행사가 없어요.' : '등록된 일정이 없어요.'}
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}