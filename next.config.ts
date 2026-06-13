import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/sanka-proxy/:path*',
        destination: 'https://www.sankavollerei.com/:path*',
      },
    ]
  },
};

export default nextConfig;