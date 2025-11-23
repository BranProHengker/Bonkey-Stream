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
        // Ensure aired prop structure consistency if needed, mostly Jikan returns it well
      }))
      setUpcomingAnime(formattedData)
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
    <div className="min-h-screen bg-slate-900 text-white selection:bg-green-500/30 selection:text-green-100">
      <Navbar />

      <section className="relative h-[65vh] overflow-hidden flex items-center justify-start px-4 md:px-20">
        <Image
          src="/upcoming-img.png"
          alt="Upcoming Anime Hero"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        
        <div className="relative z-10 max-w-2xl animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 font-mono tracking-widest text-sm uppercase">Coming Soon</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Next Season's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Big Hits
            </span>
          </h1>
          <p className="text-lg text-slate-300 border-l-4 border-green-500 pl-6">
            Be the first to know. Add these anticipated titles to your watchlist and get ready for the premiere.
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        {/* Timeline Header */}
        <div className="flex items-center mb-12">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-green-500 mr-4 border border-slate-700 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Release Calendar</h2>
            <p className="text-slate-400 text-sm">Upcoming titles sorted by anticipation</p>
          </div>
        </div>

        {loadingUpcoming ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : upcomingAnime.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {upcomingAnime.map((anime, index) => (
              <div key={anime.mal_id} className="relative group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Timeline Connector Line (Visual Decoration) */}
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-slate-700 to-transparent hidden xl:block opacity-30" />
                
                <AnimeCard anime={anime} onClick={setSelectedAnime} />
                
                {/* Release Date Badge Overwrite style if needed prop anj */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded-lg shadow-lg">
                    {anime.aired?.prop?.from?.year || "TBA"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-slate-400">No upcoming anime found.</p>
        )}
      </section>

      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      <Footer />
    </div>
  )
}
