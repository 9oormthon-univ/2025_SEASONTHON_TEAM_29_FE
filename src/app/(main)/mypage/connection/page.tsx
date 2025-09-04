'use client';

import { useRouter } from 'next/navigation';
import CoupleLinking from './CoupleLinking';

export default function Page() {
  const router = useRouter();
  return <CoupleLinking onComplete={() => router.replace('/mypage')} />;
}
