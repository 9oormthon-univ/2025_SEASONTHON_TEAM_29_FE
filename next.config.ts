// next.config.ts
// ⚠️ Turbopack과 next-pwa는 궁합이 안 맞습니다. (아래 3번 참고)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== 'production', // 개발환경에서는 비활성화 권장
  // buildExcludes: [/middleware-manifest\.json$/], // (선택) 일부 파일 제외
});

// backend URL 처리
const backend = process.env.BACKEND_URL?.replace(/\/$/, '');

const baseConfig = {
  eslint: { ignoreDuringBuilds: true },
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

module.exports = withPWA(baseConfig);