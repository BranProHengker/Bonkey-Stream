"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getContinueWatching, WatchHistoryItem } from "@/app/utils/storage"

export default function ContinueWatching() {
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>([])

  useEffect(() => {
    const items = getContinueWatching(8)
    setContinueWatching(items)
  }, [])

  if (continueWatching.length === 0) {
    return null
  }

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Continue Watching</h2>
            <p className="text-slate-400">Pick up where you left off</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {continueWatching.map((item) => (
            <Link
              key={item.episodeSlug}
              href={`/stream/watch/${item.episodeSlug}`}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10 shadow-2xl transition-transform hover:scale-105 hover:ring-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {item.animePoster ? (
                <Image
                  src={item.animePoster}
                  alt={item.animeTitle}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-80"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  loading="lazy"
                  quality={85}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 group-hover:opacity-100 transition-opacity" />
              
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/50">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors mb-1">
                  {item.animeTitle}
                </h3>
                <p className="text-xs text-slate-300 mb-2">{item.episodeTitle}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{Math.round(item.progress)}% watched</span>
                </div>
              </div>

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
