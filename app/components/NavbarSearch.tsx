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

const STORAGE_KEY = "anime_recent_searches"
const MAX_RECENT_SEARCHES = 10

export default function NavbarSearch({ onClose }: NavbarSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AnimeResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Close search when route changes
  useEffect(() => {
    setIsOpen(false)
    setQuery("")
    setResults([])
    if (onClose) onClose()
  }, [pathname, onClose])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setRecentSearches(Array.isArray(parsed) ? parsed : [])
        } catch {
          setRecentSearches([])
        }
      }
    }
  }, [])

  // CTRL+K / CMD+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

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
        // Save to recent searches
        const trimmedQuery = searchQuery.trim()
        setRecentSearches((prev) => {
          const filtered = prev.filter((item) => item.toLowerCase() !== trimmedQuery.toLowerCase())
          const updated = [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES)
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          }
          return updated
        })
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

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm)
    handleSearch(searchTerm)
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
      className="p-2 rounded-full hover:bg-slate/50 transition-colors text-periwinkle hover:text-white"
      aria-label="Open Search"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  )

  if (!isOpen) return triggerButton

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>
      
      {/* Search Modal */}
      <div className="relative w-full max-w-3xl bg-bg-popover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        
        {/* Input Area */}
        <div className="flex items-center px-6 py-2 border-b border-white/5 bg-bg-card/50">
          <svg className="w-6 h-6 text-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              // Auto-search precisely when 5 characters are typed
              if (val.length === 5) {
                handleSearch(val);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search anime..."
            className="w-full bg-transparent text-xl md:text-2xl font-light text-white placeholder:text-periwinkle py-4 pl-4 pr-4 outline-none"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-periwinkle hover:text-white transition-colors rounded-lg hover:bg-slate/50 bg-slate/20 border border-white/5 text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col h-[60vh] max-h-[600px] overflow-hidden">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !loading && !query.trim() && (
            <div className="px-6 py-4 opacity-80 border-b border-white/5 bg-bg-popover">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-periwinkle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-periwinkle uppercase tracking-wider">Recent</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((searchTerm, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(searchTerm)}
                    className="px-3 py-1.5 text-sm text-periwinkle bg-slate/30 hover:bg-slate border border-white/5 hover:border-indigo/50 rounded-lg transition-all hover:text-white"
                  >
                    {searchTerm}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Scroll Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-indigo border-t-transparent animate-spin"></div>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-8">
                {results.map((anime) => (
                  <Link
                    key={anime.slug}
                    href={`/stream/${anime.slug}`}
                    className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-bg-card border border-white/5 shadow-lg transition-transform hover:scale-[1.02] hover:border-indigo/50 focus:outline-none"
                    onClick={() => setIsOpen(false)}
                  >
                    {anime.poster ? (
                      <Image 
                        src={anime.poster} 
                        alt={anime.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-bg-card text-periwinkle text-xs">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform transition-transform">
                      <h3 className="text-white font-medium text-xs line-clamp-2 leading-tight">
                        {anime.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {anime.score && (
                          <span className="text-[9px] font-bold text-white bg-indigo px-1.5 py-0.5 rounded shadow-sm">
                             {anime.score}
                          </span>
                        )}
                        <span className="text-[9px] font-medium text-periwinkle uppercase tracking-wide">
                          {anime.type || "Anime"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="flex flex-col items-center justify-center h-full text-periwinkle">
                <p className="text-sm font-medium">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-periwinkle opacity-50">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm font-light">Type to search the catalog</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

