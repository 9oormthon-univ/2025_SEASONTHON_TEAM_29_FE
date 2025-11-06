'use client';

import { NotificationProvider } from '@/components/providers/NotificationProvider';
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </ReactQueryProvider>
  );
}