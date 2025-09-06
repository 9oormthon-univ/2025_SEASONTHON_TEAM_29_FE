'use client';

import { useEffect } from 'react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  keepMounted?: boolean;
};

export default function BottomSheet({
  open,
  onClose,
  className,
  children,
  keepMounted = false,
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

  if (!open && !keepMounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={clsx(
        'fixed inset-0 z-[60] flex items-end justify-center transition',
        !open && 'pointer-events-none',
      )}
    >
      <button
        aria-label="닫기"
        onClick={onClose}
        className={clsx(
          'absolute inset-0 bg-black/40 transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        className={clsx(
          'relative w-full max-w-96 rounded-t-xl bg-white shadow-xl',
          'pb-[env(safe-area-inset-bottom)]',
          'transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
          className,
        )}
      >
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-11 rounded-full bg-gray-300" />
        </div>
        <div className="p-4 pt-3 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
