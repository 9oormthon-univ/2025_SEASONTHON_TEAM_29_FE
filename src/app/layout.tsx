import '@/app/globals.css';
import { Providers } from '@/lib/providers';
import type { Viewport } from 'next';
import Script from 'next/script';
import { PwaHead } from './_pwa-head';

export const metadata = {
  title: "웨딧",
  description: "예식장 · 스드메 · 혼수 가격/구성/후기 비교 플랫폼",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/pwa192-2.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/pwa512-2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/pwa180-2.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#FDFDFD',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <PwaHead />
        {process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY && (
          <Script
            id="kakao-maps-sdk"
            src={`https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&libraries=services`}
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-dvh bg-white text-gray-900 antialiased overflow-x-hidden touch-pan-y touch-manipulation">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}