// next.config.mjs
import withPWA from 'next-pwa';

/** PWA 옵션 */
const withPwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production',
});

/** @type {import('next').NextConfig} */
const baseConfig = {
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    const backend = process.env.BACKEND_URL?.replace(/\/$/, '');
    if (!backend) {
      console.warn('⚠️ BACKEND_URL is not set');
      return [];
    }
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};

export default withPwa(baseConfig);