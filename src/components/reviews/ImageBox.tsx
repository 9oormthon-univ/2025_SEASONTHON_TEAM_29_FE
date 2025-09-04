'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type Props = {
  images: string[];
  startIndex?: number;
  onClose: () => void;
};

export default function ImageLightbox({
  images,
  startIndex = 0,
  onClose,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const THRESHOLD = 50;

  const clamp = (v: number) => Math.max(0, Math.min(images.length - 1, v));
  const nextSlide = () => setIndex((i) => clamp(i + 1));
  const prevSlide = () => setIndex((i) => clamp(i - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current == null) return;
    setDragX(e.touches[0].clientX - startXRef.current);
  };
  const onTouchEnd = () => {
    if (Math.abs(dragX) > THRESHOLD) {
      dragX < 0 ? nextSlide() : prevSlide();
    }
    setIsDragging(false);
    setDragX(0);
    startXRef.current = null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || startXRef.current == null) return;
    setDragX(e.clientX - startXRef.current);
  };
  const onMouseUp = () => onTouchEnd();
  const onMouseLeave = () => isDragging && onTouchEnd();

  const width = typeof window !== 'undefined' ? window.innerWidth : 375;
  const translate = -index * width + (isDragging ? dragX : 0);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 text-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="h-12 px-4 flex items-center justify-between">
        <button
          aria-label="닫기"
          onClick={onClose}
          className="p-2 -ml-2 active:opacity-80"
        >
          <Image src="/cancel.svg" alt="close" width={24} height={24} />
        </button>
        <div className="text-base">
          {index + 1}/{images.length}
        </div>
        <div className="w-6" />
      </div>

      {/* Slides */}
      <div
        className="relative h-[calc(100vh-48px)] touch-pan-y select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={clsx('absolute inset-y-0 will-change-transform flex')}
          style={{
            width: `${images.length * 100}vw`,
            transform: `translate3d(${translate}px,0,0)`,
            transition: isDragging ? 'none' : 'transform 260ms ease',
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="w-screen h-full flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`image-${i + 1}`}
                className="max-h-full max-w-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
        <button
          aria-label="이전"
          onClick={prevSlide}
          className="absolute left-0 top-0 h-full w-1/3 opacity-0"
        />
        <button
          aria-label="다음"
          onClick={nextSlide}
          className="absolute right-0 top-0 h-full w-1/3 opacity-0"
        />
      </div>
    </div>
  );
}
