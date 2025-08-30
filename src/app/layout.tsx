import '@/app/globals.css';
import { Providers } from '@/lib/providers';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '웨딧 | 결혼 준비도 쉽고, 투명하게',
  description: '예식장 · 스드메 · 혼수 가격/구성/후기 비교 플랫폼',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-white text-gray-900 antialiased overflow-x-hidden touch-pan-y touch-manipulation">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}