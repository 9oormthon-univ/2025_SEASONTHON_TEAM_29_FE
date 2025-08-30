import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 빌드 시 eslint 검사하지 않음 (임시)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
