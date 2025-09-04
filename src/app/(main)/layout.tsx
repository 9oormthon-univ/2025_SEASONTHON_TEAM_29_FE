'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/common/atomic/BottomNav';
import { Container } from '@/components/common/atomic/Container';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';

  const HIDE_EXACT = ['/search', '/search/filters'];
  const HIDE_PREFIX = [
    '/tours/',
    '/mypage/connection',
    '/mypage/review',
    '/editorials',
    '/reservation',
  ];

  const hideBottomNav =
    HIDE_EXACT.includes(pathname) ||
    HIDE_PREFIX.some((p) => pathname.startsWith(p));
  return (
    <Suspense fallback={null}>
      <AuthGuard>
        <div className="flex min-h-dvh flex-col overflow-x-hidden touch-manipulation">
          <Container className="flex-1">{children}</Container>
          {!hideBottomNav && <BottomNav />}
        </div>
      </AuthGuard>
    </Suspense>
  );
}
