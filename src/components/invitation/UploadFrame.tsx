'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utills/cn';

export default function UploadFrame({
  value,
  onChange,
  className,
}: {
  value?: File | null;
  onChange: (f: File | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file ?? null);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          'relative w-82 h-70 border border-box-line bg-zinc-200 cursor-pointer overflow-hidden',
          className,
        )}
        aria-label="메인 사진 업로드 프레임"
      >
        {objectUrl && (
          <Image
            src={objectUrl}
            alt="uploaded"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/LoveWinsAll.svg"
            alt="Love Wins All"
            className="w-48 h-auto opacity-90"
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-text--secondary">
        프레임을 클릭하면 사진을 넣을 수 있어요.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
