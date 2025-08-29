'use client';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  // React Query, Theme, Toast 등 여기서 감싸기
  return <>{children}</>;
}