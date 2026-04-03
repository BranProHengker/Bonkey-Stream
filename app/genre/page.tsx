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
  }, [isLoading, selectedGenre]) 

  const handleGenreChange = (genreName: GenreKey) => {
    setSelectedGenre(genreName)
  }

  if (isLoading) return <LoadingPage />

  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-indigo/80 selection:text-white">
      <Navbar />

      {/* Cinematic Hero with Background Image */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden flex items-center justify-center">
        <Image src="/my-kanojo-4.jpeg" alt="Anime Genre" fill style={{ objectFit: "cover" }} className="opacity-30" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-black/40" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <span className="text-periwinkle text-xs font-semibold tracking-[0.2em] uppercase mb-4 block opacity-80">
            Catalog Explorer
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white tracking-tight">
            Browse by Genre
          </h1>
          <p className="text-base md:text-lg text-periwinkle max-w-xl mx-auto font-light opacity-80">
            Discover your next favorite series from our curated collection of critically acclaimed anime.
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-7xl">
        {/* Cinematic Tag Cloud Navigation */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-2 p-2">
            {Object.keys(genres).map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre as GenreKey)}
                className={`px-5 py-2.5 rounded text-xs tracking-wider uppercase font-medium transition-all duration-300 ${
                  selectedGenre === genre
                    ? "bg-white text-bg-dark shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    : "bg-transparent text-periwinkle hover:text-white border border-white/5 hover:border-white/20 hover:bg-white/5"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          <div className="flex items-end justify-between mb-10 px-2 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {selectedGenre}
              </h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-periwinkle">
              Top Rated
            </span>
          </div>

          {isLoadingData ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-bg-card rounded-xl aspect-[2/3] border border-white/5 animate-pulse flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full border-2 border-indigo border-t-transparent animate-spin opacity-50"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
              {genreAnime[selectedGenre]?.map((anime, index) => (
                <div key={anime.mal_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AnimeCard anime={anime} onClick={setSelectedAnime} />
                </div>
              ))}
            </div>
          )}
          
          {!isLoadingData && !genreAnime[selectedGenre]?.length && (
             <div className="flex flex-col items-center justify-center py-32 text-periwinkle opacity-50">
               <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
               <div className="text-sm font-light">No content found in this category.</div>
             </div>
          )}
        </div>
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />
    </div>
  )
}
