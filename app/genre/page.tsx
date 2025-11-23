"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import AnimeCard from "@/app/components/AnimeCard"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Anime } from "@/app/types/anime"

interface GenreAnime {
  [key: string]: Anime[]
}

const genres = {
  Action: 1, Adventure: 2, Comedy: 4, Drama: 8, Fantasy: 10, 
  Horror: 14, Mystery: 7, Romance: 22, "Sci-Fi": 24, "Slice of Life": 36,
  Sports: 30, Supernatural: 37, Thriller: 41, Psychological: 40,
  Historical: 13, Military: 38, School: 23, Music: 19, Mecha: 18
} as const

type GenreKey = keyof typeof genres

export default function GenrePage() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<GenreKey>("Action")
  const [genreAnime, setGenreAnime] = useState<GenreAnime>({})
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAnimeByGenre = async (genreName: GenreKey, genreId: number) => {
    try {
      setIsLoadingData(true)
      const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&limit=12&order_by=score&sort=desc`)
      const data = await response.json()

      if (data.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedAnime = data.data.map((anime: any) => ({
          mal_id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english,
          images: anime.images,
          synopsis: anime.synopsis,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          score: anime.score,
          rating: anime.rating,
          genres: anime.genres?.map((g: { mal_id: number; name: string }) => ({ mal_id: g.mal_id, name: g.name })) || [],
          aired: anime.aired,
        }))

        setGenreAnime((prev) => ({
          ...prev,
          [genreName]: formattedAnime,
        }))
      }
    } catch (error) {
      console.error(`Error fetching ${genreName} anime:`, error)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && !genreAnime[selectedGenre]) {
      fetchAnimeByGenre(selectedGenre, genres[selectedGenre])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, selectedGenre]) // Removed genres and genreAnime dependency loops

  const handleGenreChange = (genreName: GenreKey) => {
    setSelectedGenre(genreName)
  }

  if (isLoading) return <LoadingPage />

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      <Navbar />

      {/* Hero / Header Section */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden flex items-center justify-center">
        <Image src="/my-kanojo-4.jpeg" alt="Anime Genre" fill style={{ objectFit: "cover" }} className="opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Genre</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Find your perfect match. Whether you love heart-pounding action or heartwarming romance, we have it all.
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        {/* Tag Cloud Navigation */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3 p-6 bg-slate-800/30 backdrop-blur-md rounded-2xl border border-white/5">
            {Object.keys(genres).map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre as GenreKey)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedGenre === genre
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105 ring-2 ring-purple-400/50"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white pl-4 border-l-4 border-purple-500">
              {selectedGenre} <span className="text-slate-500 text-lg font-normal ml-2">Top Rated</span>
            </h2>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent ml-6" />
          </div>

          {isLoadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {genreAnime[selectedGenre]?.map((anime, index) => (
                <div key={anime.mal_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AnimeCard anime={anime} onClick={setSelectedAnime} />
                </div>
              ))}
            </div>
          )}
          
          {!isLoadingData && !genreAnime[selectedGenre]?.length && (
             <div className="text-center py-20 text-slate-500">No anime found for this genre.</div>
          )}
        </div>
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />
    </div>
  )
}
