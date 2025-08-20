"use client"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function UpcomingPage() {
  const [upcomingAnime, setUpcomingAnime] = useState([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [selectedAnime, setSelectedAnime] = useState(null)

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

  const openModal = (anime) => {
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

                    {/* Genre badge in top-left */}
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                          {anime.genres[0].name}
                        </span>
                      </div>
                    )}

                    {/* Upcoming badge in top-right */}
                    <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded">
                      <span className="text-green-400 text-sm mr-1">🔜</span>
                      <span className="text-white text-sm font-medium">Soon</span>
                    </div>
                  </div>

                  {/* Title and additional info below image */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-green-400 transition-colors duration-200">
                      {anime.title}
                    </h3>

                    {/* Additional genre tags */}
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

      {selectedAnime && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-400 z-10 bg-gray-800 rounded-full p-2 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                <Image
                  src={selectedAnime.images.jpg.large_image_url || "/placeholder.svg"}
                  alt={selectedAnime.title}
                  width={300}
                  height={400}
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{selectedAnime.title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-bold text-green-400">Type:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.type}</span>
                  </div>
                  <div>
                    <span className="font-bold text-green-400">Episodes:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.episodes || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-green-400">Status:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.status}</span>
                  </div>
                  <div>
                    <span className="font-bold text-green-400">Score:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.score || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-green-400">Aired:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.aired?.string || "TBA"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-green-400">Rating:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.rating || "Not available"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-green-400">Synopsis:</p>
                  <div className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto bg-gray-800 p-4 rounded-lg">
                    {selectedAnime.synopsis || "No synopsis available"}
                  </div>
                </div>

                {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-bold text-green-400">Genres:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnime.genres.map((genre) => (
                        <span key={genre.mal_id} className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
