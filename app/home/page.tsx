"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import AnimeCard from "@/app/components/AnimeCard"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Anime } from "@/app/types/anime"

export default function HomePage() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [recommendedAnime, setRecommendedAnime] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendedAnime = async () => {
      try {
        setIsLoading(true)
        // Fetching popular anime instead of specific names for better variety
        const response = await fetch("https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=12")
        
        if (!response.ok) throw new Error("Failed to fetch anime")
        
        const data = await response.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validResults = data.data.map((anime: any) => ({
          mal_id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english,
          images: anime.images,
          synopsis: anime.synopsis,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          score: anime.score,
          rating: anime.rating || "Unknown",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          genres: anime.genres?.map((g: any) => ({ mal_id: g.mal_id, name: g.name })) || [],
          aired: anime.aired || { string: "Unknown" },
        })) as Anime[]

        setRecommendedAnime(validResults)
        setError(null)
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
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error Loading Recommendations</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-cyan-500/30 selection:text-cyan-100">
      <Navbar />

      {/* Hero Section - Parallax & Glassmorphism */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Image with Parallax Scale */}
        <div className="absolute inset-0 animate-slow-zoom">
          <Image
            src="/my-kanojo-2.jpeg"
            alt="Hero Background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            className="opacity-60"
            priority
          />
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/50 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-900/40 to-slate-900" />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-fade-in-down shadow-lg shadow-black/20">
            <span className="text-cyan-400 font-semibold tracking-wider text-sm uppercase">
              Your Ultimate Anime Database
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight animate-fade-in-up drop-shadow-2xl">
            <span className="text-white">Bonkey</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 ml-4">
              Stream
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed animate-fade-in-up delay-100 drop-shadow-md">
            Dive into an immersive anime library. Discover thousands of titles, track your progress, and explore the community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-cyan-500/25 w-full sm:w-auto hover:shadow-cyan-400/40">
              Browse Database
            </button>
            <Link href="/genre" className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/10 transition-all hover:scale-105 w-full sm:w-auto text-center hover:border-white/20 shadow-lg shadow-black/20">
              Explore Genres
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-slate-500/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 relative">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Trending Now</h2>
              <p className="text-slate-400">Most watched anime this week</p>
            </div>
            <a href="/popular" className="hidden md:flex items-center text-cyan-400 hover:text-cyan-300 transition-colors group">
              View All 
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recommendedAnime.map((anime, index) => (
              <div key={anime.mal_id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                <AnimeCard anime={anime} onClick={setSelectedAnime} />
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <button className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors">
              View All Trending
            </button>
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
        @keyframes scroll-down {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(6px); opacity: 0; }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
        .animate-scroll-down {
          animation: scroll-down 1.5s infinite;
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  )
}
