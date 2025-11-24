import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['cdn.myanimelist.net', 'i.imgur.com', 'i.pinimg.com', 'github.com', 'img.icons8.com'],
  },
};

export default nextConfig;