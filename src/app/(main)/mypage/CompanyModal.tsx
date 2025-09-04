'use client';

import { useEffect } from 'react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
};

export default function BottomSheet({
  open,
  onClose,
  className,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-end justify-center"
    >
      <button
        aria-label="닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative w-full max-w-96 rounded-t-xl bg-white shadow-xl',
          'pb-[env(safe-area-inset-bottom)]',
          className,
        )}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-11 rounded-full bg-gray-300" />
        </div>
        <div className="p-4 pt-3">{children}</div>
      </div>
    </div>
  );
}
