import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Enable Next.js image optimization (auto WebP/AVIF conversion, resizing)
    remotePatterns: [
        { protocol: 'https', hostname: 'cdn.myanimelist.net' },
        { protocol: 'https', hostname: 'myanimelist.net' },
        { protocol: 'https', hostname: 'i.imgur.com' },
        { protocol: 'https', hostname: 'i.pinimg.com' },
        { protocol: 'https', hostname: 'github.com' },
        { protocol: 'https', hostname: 'img.icons8.com' },
        { protocol: 'https', hostname: 'otakudesu.best' },
        { protocol: 'https', hostname: 'v1.samehadaku.how' },
        { protocol: 'https', hostname: 'www.sankavollerei.com' },
        { protocol: 'https', hostname: '**.samehadaku.**' },
    ],
    // Optimize for common device widths
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600, // Cache optimized images for 1hr
  },
};

export default nextConfig;