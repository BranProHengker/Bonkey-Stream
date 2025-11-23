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
    <div className="min-h-screen bg-slate-900 text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      <Navbar />

      <section className="relative h-[50vh] overflow-hidden flex items-center justify-center">
        <Image
          src="/my-kanojo-3.png"
          alt="Popular Anime Hero"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
        
        <div className="relative z-10 text-center">
          <div className="inline-block p-3 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6 animate-bounce">
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in-up">
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Fame</span>
          </h1>
          <p className="text-lg text-slate-300 animate-fade-in-up delay-100">
            The highest-rated anime of all time, voted by the community.
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 relative z-20 -mt-20">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
          {loadingPopular ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400">Calculating rankings...</p>
            </div>
          ) : popularAnime.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
            <p className="text-center text-slate-400">No data available.</p>
          )}
        </div>
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />
    </div>
  )
}
