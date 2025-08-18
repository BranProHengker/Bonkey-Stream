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

      <section className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
        <Image src="/my-kanojo-4.jpeg" alt="Anime Genre" fill style={{ objectFit: "cover" }} className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Anime by Genre</h2>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-200 mb-8 drop-shadow-md leading-relaxed">
            Discover anime organized by your favorite genres. Find exactly what you're looking for.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {/* Genre Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
            {Object.keys(genres).map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedGenre === genre
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">{selectedGenre} Anime</h2>

          {isLoadingData ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading {selectedGenre} anime...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {genreAnime[selectedGenre]?.map((anime) => (
                <div
                  key={anime.id}
                  className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  onClick={() => openModal(anime)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Genre badge in top-left */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md shadow-lg">
                        {anime.genre}
                      </span>
                    </div>

                    {/* Rating in top-right */}
                    {anime.score && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="flex items-center bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                          <span className="text-yellow-400 text-xs mr-1">★</span>
                          <span className="text-white text-xs font-medium">{anime.score}</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
                      {anime.title}
                    </h3>

                    {/* Additional genre tags */}
                    {anime.genres && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {anime.genres
                          .split(", ")
                          .slice(0, 3)
                          .map((genre, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
                              {genre}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Episode info */}
                    {anime.episodes && (
                      <p className="text-gray-400 text-sm">
                        {anime.episodes} episodes • {anime.type}
                      </p>
                    )}
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400">No anime found for this genre.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedAnime && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="flex justify-center">
                  <div className="relative aspect-[3/4] w-full max-w-sm">
                    <Image
                      src={selectedAnime.image || "/placeholder.svg"}
                      alt={selectedAnime.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">{selectedAnime.title}</h2>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        <span className="font-bold">Type:</span> {selectedAnime.type}
                      </p>
                      <p>
                        <span className="font-bold">Episodes:</span> {selectedAnime.episodes || "Unknown"}
                      </p>
                      <p>
                        <span className="font-bold">Status:</span> {selectedAnime.status}
                      </p>
                      <p>
                        <span className="font-bold">Aired:</span> {selectedAnime.aired}
                      </p>
                      {selectedAnime.score && (
                        <p>
                          <span className="font-bold">Rating:</span> ⭐ {selectedAnime.score}/10
                        </p>
                      )}
                      <p>
                        <span className="font-bold">Genres:</span> {selectedAnime.genres}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedAnime.synopsis || "No synopsis available."}
                    </p>
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
