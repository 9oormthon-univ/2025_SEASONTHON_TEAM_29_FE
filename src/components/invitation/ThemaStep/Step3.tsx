'use client';

import Button from '@/components/common/atomic/Button';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Step3({
  files,
  onChangeFile,
  onNext,
}: {
  files: File | null;
  onChangeFile: (f: File | null) => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );

  return (
    <div className="px-6 pt-6">
      <p className="text-sm font-medium text-text--default">
        영화같은 순간을 담아주세요
      </p>
      <h2 className="mt-1 text-xl font-bold text-text--default pb-12">
        메인사진을 담아주세요.
      </h2>

      <button
        type="button"
        aria-label="티켓 이미지 선택"
        onClick={() => inputRef.current?.click()}
        className="relative mx-auto mt-8 block w-45 md:w-80 aspect-[185/370] cursor-pointer"
      >
        {!url && (
          <img
            src="/ticket.svg"
            alt="ticket"
            className="absolute inset-0 w-full h-full"
          />
        )}
        {url && (
          <svg
            viewBox="0 0 185 370"
            className="absolute inset-0 block w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <clipPath id="ticketClip">
                <path d="M32.4336 0C32.4336 3.467 35.2439 6.27734 38.7109 6.27734C42.1779 6.27728 44.9883 3.46696 44.9883 0H52.3125C52.3125 3.46688 55.123 6.27716 58.5898 6.27734C61.9485 6.27734 64.6912 3.64011 64.8594 0.323242L64.8682 0H72.1924C72.1924 3.467 75.0027 6.27734 78.4697 6.27734C81.9367 6.27725 84.7471 3.46694 84.7471 0H92.0713C92.0713 3.4669 94.8818 6.27719 98.3486 6.27734C101.707 6.27734 104.45 3.64011 104.618 0.323242L104.627 0H111.948C111.948 3.46685 114.759 6.2771 118.226 6.27734C121.584 6.27734 124.327 3.64011 124.495 0.323242L124.504 0H131.828C131.828 3.467 134.638 6.27734 138.105 6.27734C141.572 6.27731 144.383 3.46698 144.383 0H151.707C151.707 3.46686 154.518 6.27712 157.984 6.27734C161.343 6.27734 164.086 3.64011 164.254 0.323242L164.263 0H168.448C168.448 9.11504 175.305 16.6272 184.142 17.6631V351.666C175.305 352.702 168.448 360.215 168.448 369.33H164.263C164.263 365.863 161.451 363.053 157.984 363.053C154.518 363.053 151.707 365.863 151.707 369.33H144.383C144.383 365.863 141.572 363.053 138.105 363.053C134.638 363.053 131.828 365.863 131.828 369.33H124.504C124.504 365.863 121.693 363.053 118.226 363.053C114.759 363.053 111.948 365.863 111.948 369.33H104.627C104.627 365.863 101.816 363.053 98.3486 363.053C94.8818 363.053 92.0713 365.863 92.0713 369.33H84.7471C84.7471 365.863 81.9367 363.053 78.4697 363.053C75.0027 363.053 72.1924 365.863 72.1924 369.33H64.8682C64.8682 365.863 62.0568 363.053 58.5898 363.053C55.123 363.053 52.3125 365.863 52.3125 369.33H44.9883C44.9883 365.863 42.1779 363.053 38.7109 363.053C35.2439 363.053 32.4336 365.863 32.4336 369.33H19.8779C19.8779 359.507 11.9149 351.543 2.0918 351.543C1.38414 351.543 0.686072 351.586 0 351.666V17.6631C0.686103 17.7435 1.38411 17.7861 2.0918 17.7861C11.9149 17.786 19.8779 9.82311 19.8779 0H32.4336Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#ticketClip)">
              <image
                href={url}
                x="0"
                y="0"
                width="185"
                height="370"
                preserveAspectRatio="xMidYMid slice"
              />
              <image
                href="/TicketLogo.svg"
                x="5"
                y="35"
                width="20"
                height="80"
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: 'none', opacity: 1 }}
              />
            </g>
          </svg>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </button>

      <p className="mt-3 text-xs text-text--secondary text-center">
        프레임을 클릭하면 사진을 넣을 수 있어요.
      </p>
      <div className="fixed inset-x-0 bottom-0 px-6 pb-20 pt-4 bg-white/80 backdrop-blur">
        <Button fullWidth onClick={onNext}>
          등록하기
        </Button>
      </div>
    </div>
  );
}
