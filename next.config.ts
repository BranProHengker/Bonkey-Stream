import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
        { hostname: 'cdn.myanimelist.net' },
        { hostname: 'i.imgur.com' },
        { hostname: 'i.pinimg.com' },
        { hostname: 'github.com' },
        { hostname: 'img.icons8.com' },
        { hostname: 'otakudesu.best' },
        { hostname: 'v1.samehadaku.how' } // Added for Samehadaku API
    ],
  },
};

export default nextConfig;