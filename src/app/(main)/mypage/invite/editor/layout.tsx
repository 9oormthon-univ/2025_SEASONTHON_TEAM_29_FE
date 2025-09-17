'use client';

import Providers from '@/app/providers';

export default function InviteEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
