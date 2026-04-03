"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import AnimeCard from "@/app/components/AnimeCard"
import ContinueWatching from "@/app/components/ContinueWatching"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Anime } from "@/app/types/anime"

export default function RootPage() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [recommendedAnime, setRecommendedAnime] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendedAnime = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12")
        if (!response.ok) throw new Error("Failed to fetch anime")
        
        const data = await response.json()
        const validResults = data.data.map((anime: any) => ({
          mal_id: anime.mal_id,
          title: anime.title,
          images: anime.images,
          synopsis: anime.synopsis,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          score: anime.score,
          genres: anime.genres?.map((g: any) => ({ mal_id: g.mal_id, name: g.name })) || [],
        })) as Anime[]

        setRecommendedAnime(validResults)
      } catch (err) {
        console.error("Error fetching anime:", err)
        setError("Failed to load anime recommendations")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedAnime()
  }, [])

  if (isLoading) return <LoadingPage />
  if (error) {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center">
        <p className="text-periwinkle font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-indigo/80 selection:text-white">
      <Navbar />

      {/* Hero Section - Cinematic Glassmorphism */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image with Slow Zoom */}
        <div className="absolute inset-0 animate-[slow-zoom_20s_linear_infinite_alternate]">
          <Image
            src="/my-kanojo-2.jpeg"
            alt="Hero Background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            className="opacity-40"
            priority
          />
        </div>
        
        {/* Deep Gradients for cinematic transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-black/60" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 max-w-6xl flex flex-col justify-end h-full pb-32">
          <div className="animate-fade-in-up">
            <span className="text-periwinkle font-medium tracking-widest text-xs uppercase mb-3 block">
              Trending Series
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-2xl">
              <span className="text-white">Bonkey Stream</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-periwinkle mb-10 font-light drop-shadow-md">
              Dive into an immersive cinematic library. Discover thousands of titles, 
              track your watch history elegantly, and step into the stories you love.
            </p>
            <div className="flex items-center gap-4">
              <button 
                className="px-8 py-3.5 bg-white text-bg-dark font-semibold rounded hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                Explore Now
              </button>
              <Link href="/genre" className="px-8 py-3.5 bg-bg-popover/80 backdrop-blur-md text-white font-medium rounded border border-white/10 hover:border-white/30 transition-all hover:bg-bg-popover shadow-lg">
                View Genres
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Trending Section */}
      <section className="py-24 relative z-10 bg-bg-dark">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10 px-2 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Trending Now</h2>
            </div>
            <Link href="/popular" className="text-xs font-semibold uppercase tracking-widest text-periwinkle hover:text-white transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {recommendedAnime.map((anime, index) => (
              <div key={anime.mal_id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                <AnimeCard anime={anime} onClick={setSelectedAnime} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />

      <style jsx global>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
