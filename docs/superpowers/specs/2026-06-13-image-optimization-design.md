# Next.js Custom Image Optimization via wsrv.nl

## Overview
This design document outlines the implementation of a custom image loader for Next.js to bypass Vercel's built-in Image Optimization API. The goal is to completely eliminate Vercel Image Transformation usage (which currently exceeds the hobby tier quota) by routing external image requests through the free, public image proxy `images.weserv.nl` (wsrv.nl).

## Purpose & Context
The Bonkey-Stream application fetches thousands of anime posters/covers from external APIs (MyAnimeList, Samehadaku, Otakudesu). By default, Next.js's `<Image>` component routes these through Vercel's image optimization edge network, consuming quota for every unique transformation. Since this quota is capped at 5000 images per cycle on the hobby tier, it frequently hits the limit. Using a custom loader that proxies to `wsrv.nl` will reduce Vercel quota usage to exactly 0 while maintaining high performance, WebP/AVIF compression, and responsive sizing.

## Architecture & Components

### 1. Custom Loader Function (`app/utils/imageLoader.ts`)
We will create a pure JavaScript/TypeScript function that formats image URLs specifically for Next.js.
- **Input**: `{ src, width, quality }`
- **Logic**:
  - If `src` starts with `/` (local asset): Return `src` as is. Local assets do not need remote proxying and `wsrv.nl` cannot resolve `localhost` during development.
  - If `src` is external (`http://` or `https://`): Return a newly formatted URL pointing to `wsrv.nl` with the appropriate query parameters (`url`, `w`, `q`, `output=webp`).

### 2. Next.js Configuration (`next.config.ts`)
We will update the Next.js configuration to enforce the custom loader globally.
- Remove the extensive `remotePatterns` list as it will no longer be needed by Next.js's default optimizer.
- Add the `loader: 'custom'` directive.
- Add the `loaderFile: './app/utils/imageLoader.ts'` directive.

## Data Flow
1. Next.js `<Image>` component receives an external `src` (e.g., `https://cdn.myanimelist.net/images/anime/10/47347.jpg`).
2. Next.js calls the custom loader in `imageLoader.ts`.
3. The loader returns `https://wsrv.nl/?url=https%3A%2F%2Fcdn.myanimelist.net%2Fimages%2Fanime%2F10%2F47347.jpg&w=640&q=75&output=webp`.
4. The client browser fetches the image directly from Cloudflare's edge network via `wsrv.nl`. Vercel is completely bypassed.

## Testing & Verification
1. Ensure `pnpm dev` runs without configuration errors.
2. Verify local assets (like `/favicon.png` or local logos) still render correctly.
3. Verify external anime posters render correctly.
4. Inspect network requests in the browser DevTools: image requests should point to `wsrv.nl` and return `image/webp` MIME types.

## Trade-offs
- **Pros**: Completely free, unlimited usage, zero configuration overhead for new external domains, no serverless execution costs.
- **Cons**: Dependency on a free, community-run proxy (`wsrv.nl`). In the highly unlikely event of `wsrv.nl` experiencing downtime, external images might fail to load. However, the service is backed by Cloudflare and has high availability.
