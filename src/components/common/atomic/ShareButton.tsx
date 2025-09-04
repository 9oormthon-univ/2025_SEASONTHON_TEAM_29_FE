// src/components/editorials/ShareButton.tsx
'use client';

import SvgObject from "./SvgObject";

export default function ShareButton({
  title,
  sub,
  className,
}: { title: string; sub?: string; className?: string }) {
  return (
    <button
      aria-label="공유"
      onClick={() => {
        const url = window.location.href;
        const t = title.replace(/\n/g, ' ');
        if (navigator.share) {
          navigator.share({ title: t, text: sub, url }).catch(() => {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            alert('링크가 클립보드에 복사되었어요.');
          }).catch(() => {});
        }
      }}
      className={[
        // ✅ 동그란 버튼 스타일
        'shrink-0 rounded-full border border-gray-300 p-1.5',
        'text-gray-500 transition active:scale-95 active:bg-gray-100',
        className,
      ].filter(Boolean).join(' ')}
    >
      <SvgObject
        src="/icons/share.svg"
        alt="공유 버튼"
        width={16}
        height={16}
      />
    </button>
  );
}