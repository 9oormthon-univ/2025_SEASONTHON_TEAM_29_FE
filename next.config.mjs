import withPWA from 'next-pwa';

const withPwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production',
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // 🔥 rewrites() 완전 제거
  // Next가 /api/* 를 전부 우리 App Route로 우선 처리하게 둠
};

export default withPwa(baseConfig);