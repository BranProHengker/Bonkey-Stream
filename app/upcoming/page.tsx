"use client"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import AnimeCard from "@/app/components/AnimeCard"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Anime } from "@/app/types/anime"

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUpcomingAnime = async () => {
    setLoadingUpcoming(true)
    try {
      const response = await fetch("https://api.jikan.moe/v4/seasons/upcoming")
      const data = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData = (data.data || []).map((anime: any) => ({
        ...anime,
      }))
      
      const uniqueAnime = Array.from(new Map(formattedData.map((anime: Anime) => [anime.mal_id, anime])).values())
      
      setUpcomingAnime(uniqueAnime as Anime[])
    } catch (error) {
      console.error("Error fetching upcoming anime:", error)
      setUpcomingAnime([])
    } finally {
      setLoadingUpcoming(false)
    }
  }

  useEffect(() => {
    fetchUpcomingAnime()
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <LoadingPage />

  return (
    <div className="min-h-screen bg-bg-dark text-white selection:bg-indigo/80 selection:text-white">
      <Navbar />

      <section className="relative h-[65vh] overflow-hidden flex items-center justify-start px-4 md:px-20">
        <Image
          src="/upcoming-img.png"
          alt="Upcoming Anime Hero"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent" />
        
        <div className="relative z-10 max-w-2xl animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo animate-pulse" />
            <span className="text-periwinkle font-semibold tracking-[0.2em] text-xs uppercase">Coming Soon</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Next Season&apos;s <br />
            <span className="text-periwinkle">
              Big Hits
            </span>
          </h1>
          <p className="text-lg text-periwinkle/80 border-l-2 border-indigo pl-6 font-light">
            Be the first to know. Add these anticipated titles to your watchlist and get ready for the premiere.
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4 max-w-7xl">
        {/* Timeline Header */}
        <div className="flex items-center mb-12">
          <div className="w-12 h-12 bg-bg-card rounded-xl flex items-center justify-center text-periwinkle mr-4 border border-white/5 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Release Calendar</h2>
            <p className="text-periwinkle/60 text-sm font-light">Upcoming titles sorted by anticipation</p>
          </div>
        </div>

        {loadingUpcoming ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-bg-card rounded-xl aspect-[2/3] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : upcomingAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {upcomingAnime.map((anime, index) => (
              <div key={anime.mal_id} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <AnimeCard anime={anime} onClick={setSelectedAnime} />
                
                {/* Release Date Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-2.5 py-1 bg-indigo/90 backdrop-blur text-white text-[10px] font-bold rounded shadow-lg tracking-wider uppercase">
                    {anime.aired?.string?.match(/\d{4}/)?.[0] || "TBA"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-periwinkle/50 font-light">No upcoming anime found.</p>
        )}
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />
    </div>
  )
}
