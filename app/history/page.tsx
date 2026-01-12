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
      // Sort by most recent
      const sorted = items.sort((a, b) => b.watchedAt - a.watchedAt)
      setHistory(sorted)
      setLoading(false)
    }
    loadHistory()
    
    // Listen for storage changes (if user watches from another tab)
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
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <div className="container mx-auto px-4 py-24 min-h-[80vh]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 border-b border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Watch History
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              {history.length} {history.length === 1 ? "item" : "items"} in your history
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm transition-all border border-red-500/30 hover:border-red-500/50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-500">
            <div className="bg-slate-900 p-6 rounded-full mb-6 border border-slate-800 shadow-lg shadow-cyan-900/10">
              <svg className="w-16 h-16 opacity-50 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xl font-medium text-slate-400 mb-2">No watch history yet</p>
            <p className="text-sm mb-6">Start watching anime to see your history here</p>
            <Link
              href="/stream"
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-colors"
            >
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {history.map((item) => (
              <div
                key={item.episodeSlug}
                className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10 shadow-2xl transition-transform hover:scale-105 hover:ring-cyan-400/50"
              >
                <Link href={`/stream/watch/${item.episodeSlug}`}>
                  {item.animePoster ? (
                    <Image
                      src={item.animePoster}
                      alt={item.animeTitle}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-80"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900/50">
                    <div
                      className="h-full bg-cyan-500 transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors mb-1">
                      {item.animeTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mb-2 line-clamp-1">{item.episodeTitle}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{Math.round(item.progress)}%</span>
                      </div>
                      <span className="text-[10px]">
                        {new Date(item.watchedAt).toLocaleDateString()}
                      </span>
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

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemove(item.episodeSlug)
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  aria-label="Remove from history"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
