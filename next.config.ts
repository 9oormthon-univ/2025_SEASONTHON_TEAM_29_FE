// next.config.ts
import type { NextConfig } from 'next';

const backend = process.env.BACKEND_URL?.replace(/\/$/, ''); // 뒤 슬래시 제거(// 방지)

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backend) {
      console.warn('⚠️ BACKEND_URL is not set');
      return [];
    }
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;