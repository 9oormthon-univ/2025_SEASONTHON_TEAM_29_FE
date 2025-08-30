'use client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-hidden overscroll-none touch-manipulation">
      {children}
    </div>
  );
}