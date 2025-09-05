// next.config.mjs
import withPWA from 'next-pwa';

const withPwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production',
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'standalone',
  images: {
    domains: ['wedit.me'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wedit-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
    if (!backend) return [];
    // /api/* → https://wedit.me/api/* 로 “그대로” 프록시
    return [{ source: '/api/:path*', destination: `${backend}/:path*` }];
  },
};

export default withPwa(baseConfig);
