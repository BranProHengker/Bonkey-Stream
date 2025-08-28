"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export default function Navbar() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsNavbarVisible(true)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false)
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavbarVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsSearchVisible(true)
    setLoading(true)
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data.data || [])
    } catch (error) {
      console.error("Error fetching search results:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const openModal = (anime) => {
    setSelectedAnime(anime)
  }

  const closeModal = () => {
    setSelectedAnime(null)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <a href="/home" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/favicon.png"
                  alt="Bonkey Stream Logo"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-blue-500/30 group-hover:ring-blue-400/50 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all duration-300"></div>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-white transition-all duration-300">
                  Bonkey Stream
                </h1>
                <span className="hidden sm:inline-flex text-xs bg-blue-500/20 text-blue-200 border border-blue-500/30 px-2 py-1 rounded-full">
                  WIBU
                </span>
              </div>
            </a>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/home" className="text-white hover:text-blue-400 font-medium transition-colors duration-300">
                Home
              </a>
              <a href="/genre" className="text-slate-300 hover:text-white font-medium transition-colors duration-300">
                Genre
              </a>
              <a href="/popular" className="text-slate-300 hover:text-white font-medium transition-colors duration-300">
                Popular
              </a>
              <a
                href="/upcoming"
                className="text-slate-300 hover:text-white font-medium transition-colors duration-300"
              >
                Upcoming
              </a>
              <a
                href="https://github.com/BranProHengker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white font-medium transition-colors duration-300"
              >
                About
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {!isSearchVisible ? (
                <button
                  onClick={() => setIsSearchVisible(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search anime..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch()
                        }
                      }}
                      className="w-64 pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-md outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Cari"}
                  </button>
                  <button
                    onClick={() => {
                      setIsSearchVisible(false)
                      setQuery("")
                      setSearchResults([])
                    }}
                    className="px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <button
              className="md:hidden px-3 py-2 text-white hover:bg-slate-700/50 rounded-md transition-colors duration-200"
              onClick={toggleMenu}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
              <div className="px-2 pt-4 pb-3 space-y-2">
                <a
                  href="/home"
                  className="block px-4 py-3 text-base font-medium text-white hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                >
                  Home
                </a>
                <a
                  href="/genre"
                  className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                >
                  Genre
                </a>
                <a
                  href="/popular"
                  className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                >
                  Popular
                </a>
                <a
                  href="/upcoming"
                  className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                >
                  Upcoming
                </a>
                <a
                  href="https://github.com/BranProHengker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-300"
                >
                  About
                </a>

                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search anime..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch()
                          }
                        }}
                        className="w-full pl-10 pr-3 py-2 bg-slate-800/50 border border-slate-600 text-white placeholder:text-slate-400 rounded-md outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Cari"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {isSearchVisible && query && (
        <section className="pt-20 pb-8 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Result what your looking for
              </h2>
              <p className="text-slate-400">
                Found {searchResults.length} results for "{query}"
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xl font-medium text-white">Searching...</span>
                </div>
                <p className="text-slate-400">Wait A Second....</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((anime) => (
                  <div
                    key={anime.mal_id}
                    className="group cursor-pointer bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden rounded-lg"
                    onClick={() => openModal(anime)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={anime.images.jpg.image_url || "/placeholder.svg"}
                        alt={anime.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                          View Details
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                        {anime.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-400">{anime.type}</span>
                        {anime.score && (
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm text-yellow-500">{anime.score}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mb-4">
                  <div className="text-6xl text-slate-600 mx-auto">🔍</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
                <p className="text-slate-400">It's nothing Anime what your looking for .</p>
              </div>
            )}
          </div>
        </section>
      )}

      {selectedAnime && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 px-3 py-2 text-white hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-200"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={selectedAnime.images.jpg.large_image_url || "/placeholder.svg"}
                      alt={selectedAnime.title}
                      className="rounded-lg shadow-2xl max-w-full h-auto max-h-[500px]"
                    />
                    {selectedAnime.score && (
                      <span className="absolute top-4 left-4 bg-yellow-500/90 text-black font-bold px-2 py-1 rounded-md flex items-center">
                        ★ {selectedAnime.score}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-6 overflow-y-auto max-h-[500px]">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedAnime.title}</h2>
                    {selectedAnime.title_english && selectedAnime.title_english !== selectedAnime.title && (
                      <p className="text-slate-400 mb-4">{selectedAnime.title_english}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-slate-400">Type</span>
                        <p className="text-white">{selectedAnime.type}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-400">Episodes</span>
                        <p className="text-white">{selectedAnime.episodes || "Unknown"}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-400">Status</span>
                        <span className="inline-block text-white border border-slate-600 px-2 py-1 rounded-md text-sm">
                          {selectedAnime.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-slate-400">Aired</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">📅</span>
                          <p className="text-white text-sm">{selectedAnime.aired?.string || "Unknown"}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-400">Rating</span>
                        <p className="text-white">{selectedAnime.rating || "Not available"}</p>
                      </div>
                    </div>
                  </div>

                  {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-slate-400 block mb-2">Genres</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.genres.map((genre) => (
                          <span
                            key={genre.mal_id}
                            className="bg-blue-500/20 text-blue-200 border border-blue-500/30 px-2 py-1 rounded-md text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnime.synopsis && (
                    <div>
                      <span className="text-sm font-medium text-slate-400 block mb-2">Synopsis</span>
                      <div className="text-slate-300 text-sm leading-relaxed max-h-40 overflow-y-auto">
                        {selectedAnime.synopsis}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
