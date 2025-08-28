"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function GenrePage() {
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [selectedGenre, setSelectedGenre] = useState("Action")
  const [genreAnime, setGenreAnime] = useState({})
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const genres = {
    Action: 1,
    Adventure: 2,
    Comedy: 4,
    Drama: 8,
    Fantasy: 10,
    Horror: 14,
    Mystery: 7,
    Romance: 22,
    "Sci-Fi": 24,
    "Slice of Life": 36,
    Sports: 30,
    Supernatural: 37,
    Thriller: 41,
    Psychological: 40,
    Historical: 13,
    Military: 38,
    School: 23,
    Music: 19,
    Mecha: 18,
    "Martial Arts": 17,
    Hentai: 12,
    Ecchi: 9,
    Shounen: 27,
    Shoujo: 25,
    Seinen: 42,
    Josei: 43,
    Kids: 15,
    Parody: 20,
    Samurai: 21,
    Vampire: 32,
    Yaoi: 33,
    Yuri: 34,
    Harem: 35,
    "Super Power": 31,
    Magic: 16,
    Demons: 6,
    Game: 11,
    Cars: 3,
    Space: 29,
    Police: 39,
    Dementia: 5,
  }

  const fetchAnimeByGenre = async (genreName, genreId) => {
    try {
      setIsLoadingData(true)
      const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&limit=8&order_by=score&sort=desc`)
      const data = await response.json()

      if (data.data) {
        const formattedAnime = data.data.map((anime) => ({
          id: anime.mal_id,
          title: anime.title,
          image: anime.images.jpg.large_image_url,
          genre: genreName,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          aired: anime.aired?.string,
          score: anime.score,
          synopsis: anime.synopsis,
          genres: anime.genres?.map((g) => g.name).join(", "),
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
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      fetchAnimeByGenre(selectedGenre, genres[selectedGenre])
    }
  }, [isLoading, selectedGenre])

  const handleGenreChange = (genreName) => {
    setSelectedGenre(genreName)
    if (!genreAnime[genreName]) {
      fetchAnimeByGenre(genreName, genres[genreName])
    }
  }

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

      <section className="relative h-70 sm:h-100 overflow-hidden">
        <Image src="/my-kanojo-4.jpeg" alt="Anime Genre" fill style={{ objectFit: "cover" }} className="opacity-65" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">Anime by Genre</h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-300 drop-shadow-md">
            Discover anime organized by your favorite genres. Find exactly what you're looking for.
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {Object.keys(genres).map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-3 py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                  selectedGenre === genre
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{selectedGenre} Anime</h2>

          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <p className="mt-4 text-gray-400">Loading {selectedGenre} anime...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {genreAnime[selectedGenre]?.map((anime) => (
                <div
                  key={anime.id}
                  className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={() => openModal(anime)}
                >
                  <div className="relative">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Genre badge in top-left */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        {anime.genre}
                      </span>
                    </div>

                    {/* Rating in top-right */}
                    {anime.score && (
                      <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-70 px-2 py-1 rounded">
                        <span className="text-yellow-400 text-sm mr-1">★</span>
                        <span className="text-white text-sm font-medium">{anime.score}</span>
                      </div>
                    )}
                  </div>

                  {/* Title and additional info below image */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
                      {anime.title}
                    </h3>

                    {/* Additional genre tags */}
                    {anime.genres && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {anime.genres
                          .split(", ")
                          .slice(1, 3)
                          .map((genre, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                              {genre}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{anime.type}</span>
                      <span>{anime.episodes ? `${anime.episodes} eps` : "Ongoing"}</span>
                    </div>
                  </div>
                </div>
              )) || <p className="text-lg text-gray-400">No anime found for this genre.</p>}
            </div>
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
                  src={selectedAnime.image || "/placeholder.svg"}
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
                    <span className="font-bold text-blue-400">Type:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.type}</span>
                  </div>
                  <div>
                    <span className="font-bold text-blue-400">Episodes:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.episodes || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-blue-400">Status:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.status}</span>
                  </div>
                  <div>
                    <span className="font-bold text-blue-400">Score:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.score || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-blue-400">Aired:</span>
                    <span className="ml-2 text-gray-300">{selectedAnime.aired || "Unknown"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-blue-400">Synopsis:</p>
                  <div className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto bg-gray-800 p-4 rounded-lg">
                    {selectedAnime.synopsis || "No synopsis available"}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-blue-400">Genres:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnime.genres?.split(", ").map((genre, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
