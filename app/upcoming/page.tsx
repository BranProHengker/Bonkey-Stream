"use client"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import Image from "next/image"
import { useState, useEffect } from "react"

interface AnimeGenre {
  mal_id: number
  name: string
}

interface AnimeImages {
  jpg: {
    image_url: string
    large_image_url: string
  }
}

interface AnimeAired {
  prop: {
    from: {
      year: number | null
    }
  }
  string: string
}

interface Anime {
  mal_id: number
  title: string
  images: AnimeImages
  synopsis: string
  type: string
  episodes: number | null
  status: string
  score: number | null
  rating: string
  genres: AnimeGenre[]
  aired: AnimeAired
}

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)

  const fetchUpcomingAnime = async () => {
    setLoadingUpcoming(true)
    try {
      const response = await fetch("https://api.jikan.moe/v4/seasons/upcoming")
      const data = await response.json()
      setUpcomingAnime(data.data || [])
    } catch (error) {
      console.error("Error fetching upcoming anime:", error)
      setUpcomingAnime([])
    } finally {
      setLoadingUpcoming(false)
    }
  }

  useEffect(() => {
    fetchUpcomingAnime()
  }, [])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  const openModal = (anime: Anime) => {
    setSelectedAnime(anime)
  }

  const closeModal = () => {
    setSelectedAnime(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <section className="relative h-70 sm:h-150 overflow-hidden">
        <Image
          src="/my-kanojo-5.jpeg"
          alt="Upcoming Anime Hero"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-65"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Upcoming Anime This Season
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-300 drop-shadow-md">
            Discover the most anticipated anime releases coming soon to your screens.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Anime Yang Akan Datang</h2>
          {loadingUpcoming ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <p className="mt-4 text-gray-400">Memuat anime yang akan datang...</p>
            </div>
          ) : upcomingAnime.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {upcomingAnime.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={() => openModal(anime)}
                >
                  <div className="relative">
                    <Image
                      src={anime.images.jpg.image_url || "/placeholder.svg"}
                      alt={anime.title}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {anime.genres && anime.genres.length > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                          {anime.genres[0].name}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded">
                      <span className="text-green-400 text-sm mr-1">🔜</span>
                      <span className="text-white text-sm font-medium">Soon</span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition-colors duration-200">
                      {anime.title}
                    </h3>

                    {anime.genres && anime.genres.length > 1 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {anime.genres.slice(1, 3).map((genre) => (
                          <span key={genre.mal_id} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{anime.type}</span>
                      <span>{anime.aired?.prop?.from?.year || "TBA"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-400">Tidak ada anime yang akan datang ditemukan.</p>
          )}
        </div>
      </section>

      <AnimeModal anime={selectedAnime} onClose={closeModal} />

      <Footer />
    </div>
  )
}
