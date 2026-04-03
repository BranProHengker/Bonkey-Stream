"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { getWatchHistory, removeFromWatchHistory, clearWatchHistory, WatchHistoryItem } from "@/app/utils/storage"

export default function HistoryPage() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = () => {
      const items = getWatchHistory()
      const sorted = items.sort((a, b) => b.watchedAt - a.watchedAt)
      setHistory(sorted)
      setLoading(false)
    }
    loadHistory()
    
    const handleStorageChange = () => {
      loadHistory()
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleRemove = (episodeSlug: string) => {
    removeFromWatchHistory(episodeSlug)
    setHistory(history.filter((item) => item.episodeSlug !== episodeSlug))
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all watch history?")) {
      clearWatchHistory()
      setHistory([])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-indigo border-t-transparent animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-24 min-h-[85vh] max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-white/5 pb-4 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
              Watch History
            </h1>
            <p className="text-periwinkle/60 text-sm font-light">
              {history.length} {history.length === 1 ? "item" : "items"} in your history
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="group px-4 py-2 text-red-400/80 hover:text-red-400 rounded text-sm transition-all flex items-center gap-2 mb-1"
            >
              <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-periwinkle/50 animate-fade-in-up">
            <svg className="w-16 h-16 opacity-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-light text-periwinkle mb-2">No watch history yet</p>
            <p className="text-sm mb-6 font-light">Start watching anime to see your history here.</p>
            <Link
              href="/stream"
              className="px-6 py-2.5 bg-white text-bg-dark hover:bg-slate-200 rounded font-semibold transition-colors shadow-lg"
            >
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {history.map((item, index) => (
              <div
                key={item.episodeSlug}
                className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-card ring-1 ring-white/5 hover:ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={`/stream/watch/${item.episodeSlug}`}>
                  {item.animePoster ? (
                    <Image
                      src={item.animePoster}
                      alt={item.animeTitle}
                      fill
                      className="object-cover transition-transform duration-[800ms] group-hover:scale-[1.05] opacity-90 group-hover:opacity-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      loading="lazy"
                      quality={85}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-periwinkle/30 border border-white/5">
                      No Image
                    </div>
                  )}
                  
                  {/* Deep Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Minimal Progress Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-indigo transition-all shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white font-medium text-sm line-clamp-2 leading-tight group-hover:text-periwinkle transition-colors mb-1">
                      {item.animeTitle}
                    </h3>
                    <p className="text-xs text-white/50 mb-2 font-light line-clamp-1">{item.episodeTitle}</p>
                    
                    <div className="flex items-center justify-between text-[10px] text-periwinkle/80 uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>{Math.round(item.progress)}% Watched</span>
                      <span className="text-white/30">
                        {new Date(item.watchedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-[400ms] ease-out delay-75">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </Link>

                {/* Minimal Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemove(item.episodeSlug)
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-red-500/80 rounded-full border border-transparent hover:border-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md z-10"
                  aria-label="Remove from history"
                >
                  <svg className="w-3.5 h-3.5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
