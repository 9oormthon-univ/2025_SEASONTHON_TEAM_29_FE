'use client';

import AuthGate from '@/components/auth/AuthGate';
import BottomNav from '@/components/common/atomic/BottomNav';
import { Container } from '@/components/common/atomic/Container';
import { usePathname } from 'next/navigation';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  const HIDE_EXACT = ['/search'];

  const HIDE_PREFIX: string[] = [];

  const hideBottomNav =
    HIDE_EXACT.includes(pathname) ||
    HIDE_PREFIX.some((p) => pathname.startsWith(p));
  return (
    <AuthGate>
      <div className="flex min-h-dvh flex-col overflow-x-hidden">
        <Container className="flex-1">{children}</Container>
        {!hideBottomNav && <BottomNav />}
      </div>
    </AuthGate>
  );
}