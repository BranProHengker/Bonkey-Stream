"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { searchAnime, AnimeResult } from "@/app/services/animeApi"
import { usePathname } from "next/navigation"

interface NavbarSearchProps {
  mobile?: boolean // Kept for compatibility, but we'll use a unified overlay
  isOpen?: boolean // Kept for compatibility
  onClose?: () => void
}

export default function NavbarSearch({ onClose }: NavbarSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AnimeResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Close search when route changes
  useEffect(() => {
    setIsOpen(false)
    setQuery("")
    setResults([])
    if (onClose) onClose()
  }, [pathname, onClose])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const res = await searchAnime(searchQuery)
      if (res && res.data) {
        setResults(res.data)
      } else {
        setResults([])
      }
    } catch (err) {
      console.error(err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
    if (e.key === "Escape") {
        setIsOpen(false)
    }
  }

  // Trigger button (Magnifying Glass)
  const triggerButton = (
    <button
      onClick={() => setIsOpen(true)}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
      aria-label="Open Search"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  )

  if (!isOpen) return triggerButton

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Header / Input Area */}
      <div className="container mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative group">
                <svg className="w-6 h-6 absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search anime..."
                    className="w-full bg-transparent border-b-2 border-slate-700 focus:border-cyan-400 text-2xl md:text-4xl font-bold text-white placeholder:text-slate-600 py-4 pl-10 md:pl-12 pr-4 outline-none transition-colors"
                />
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
            >
                <span className="sr-only">Close</span>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="max-w-4xl mx-auto mt-2 text-xs text-slate-500 flex gap-4">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Enter</kbd> to search</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-300">Esc</kbd> to close</span>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="container mx-auto max-w-6xl">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        <p className="text-slate-500 animate-pulse">Searching across dimensions...</p>
                    </div>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {results.map((anime) => (
                        <Link
                            key={anime.slug}
                            href={`/stream/${anime.slug}`}
                            className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10 shadow-2xl transition-transform hover:scale-105 hover:ring-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            onClick={() => setIsOpen(false)}
                        >
                            {anime.poster ? (
                                <Image 
                                    src={anime.poster} 
                                    alt={anime.title} 
                                    fill 
                                    className="object-cover transition-opacity group-hover:opacity-80" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                    No Image
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
                                    {anime.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    {anime.score && (
                                        <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20">
                                            ★ {anime.score}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-slate-300 bg-slate-700/50 px-1.5 py-0.5 rounded border border-slate-600">
                                        {anime.type || "Anime"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : query && !loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">No results found for "{query}"</p>
                    <p className="text-sm">Try searching for a different title</p>
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                    <p className="text-xl font-medium text-slate-500">Type to start searching</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

