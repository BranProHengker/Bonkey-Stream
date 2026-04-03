"use client"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import AnimeCard from "@/app/components/AnimeCard"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Anime } from "@/app/types/anime"

export default function PopularPage() {
  const [popularAnime, setPopularAnime] = useState<Anime[]>([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPopularAnime = async () => {
    setLoadingPopular(true)
    try {
      const response = await fetch("https://api.jikan.moe/v4/top/anime")
      const data = await response.json()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedAnime = data.data?.map((a: any) => ({
        mal_id: a.mal_id,
        title: a.title,
        title_english: a.title_english,
        images: a.images,
        synopsis: a.synopsis,
        type: a.type,
        episodes: a.episodes,
        status: a.status,
        score: a.score,
        rating: a.rating || "Unknown",
        genres: a.genres?.map((g: { mal_id: number; name: string }) => ({ mal_id: g.mal_id, name: g.name })) || [],
        aired: a.aired || { string: "Unknown" },
      })) as Anime[] || []

      setPopularAnime(formattedAnime)
    } catch (error) {
      console.error("Error fetching popular anime:", error)
      setPopularAnime([])
    } finally {
      setLoadingPopular(false)
    }
  }

  useEffect(() => {
    fetchPopularAnime()
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <LoadingPage />

  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-indigo/80 selection:text-white">
      <Navbar />

      <section className="relative h-[65vh] overflow-hidden flex items-center justify-center">
        <Image
          src="/popular.png"
          alt="Popular Anime Hero"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-bg-dark/60 to-bg-dark" />
        
        <div className="relative z-10 text-center">
          <span className="text-periwinkle text-xs font-semibold tracking-[0.2em] uppercase mb-4 block opacity-80">
            Community Favorites
          </span>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in-up tracking-tight">
            Don't be Karbit People
          </h1>
          <p className="text-lg text-periwinkle animate-fade-in-up delay-100 font-light">
            The highest-rated anime of all time, voted by the community.
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 relative z-20 -mt-20 max-w-7xl">
        <div className="bg-bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {loadingPopular ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-indigo border-t-transparent animate-spin mb-4" />
              <p className="text-periwinkle font-light">Calculating rankings...</p>
            </div>
          ) : popularAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {popularAnime.map((anime, index) => (
                <div key={anime.mal_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <AnimeCard 
                    anime={anime} 
                    onClick={setSelectedAnime} 
                    rank={index + 1}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-periwinkle">No data available.</p>
          )}
        </div>
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />
    </div>
  )
}
