"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import AnimeModal from "@/app/components/AnimeModal"
import { useState, useEffect } from "react"
import Image from "next/image"

// Impor tipe Anime dari file types
import { Anime } from "@/app/types/anime";

interface GenreAnime {
  [key: string]: Anime[]
}

// Tetapkan objek genres sebagai konstan agar TypeScript bisa infer tipe key-nya
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
} as const;

// Tipe GenreKey sekarang otomatis: "Action" | "Adventure" | ...
type GenreKey = keyof typeof genres;

export default function GenrePage() {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<GenreKey>("Action") // ✅ Tipe diperbaiki
  const [genreAnime, setGenreAnime] = useState<GenreAnime>({})
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAnimeByGenre = async (genreName: GenreKey, genreId: number) => { // ✅ Tipe parameter diperbaiki
    try {
      setIsLoadingData(true)
      const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}&limit=8&order_by=score&sort=desc`)
      const data = await response.json()

      if (data.data) {
        const formattedAnime = data.data.map((anime: any) => ({
          // ✅ Pastikan struktur objek sesuai dengan tipe Anime
          mal_id: anime.mal_id,
          title: anime.title,
          title_english: anime.title_english,
          images: {
            jpg: {
              large_image_url: anime.images.jpg.large_image_url,
              image_url: anime.images.jpg.image_url,
            },
          },
          synopsis: anime.synopsis,
          type: anime.type,
          episodes: anime.episodes,
          status: anime.status,
          score: anime.score,
          rating: anime.rating,
          genres: anime.genres?.map((g: any) => ({ mal_id: g.mal_id, name: g.name })) || [],
          aired: anime.aired, // Harapkan struktur yang sesuai dengan AnimeAired
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
      fetchAnimeByGenre(selectedGenre, genres[selectedGenre]) // ✅ Sekarang aman
    }
  }, [isLoading, selectedGenre, genres]) // ✅ Tambahkan genres ke dependency agar tidak ada warning

  const handleGenreChange = (genreName: GenreKey) => { // ✅ Tipe parameter diperbaiki
    setSelectedGenre(genreName)
    if (!genreAnime[genreName]) {
      fetchAnimeByGenre(genreName, genres[genreName]) // ✅ Sekarang aman
    }
  }

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
                onClick={() => handleGenreChange(genre as GenreKey)} // ✅ Pastikan genre adalah GenreKey
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
                  key={anime.mal_id} // ✅ Gunakan mal_id sebagai key
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
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        {selectedGenre}
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
                    {anime.genres && anime.genres.length > 0 && (
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
                      <span>{anime.episodes ? `${anime.episodes} eps` : "Ongoing"}</span>
                    </div>
                  </div>
                </div>
              )) || <p className="text-lg text-gray-400">No anime found for this genre.</p>}
            </div>
          )}
        </div>
      </section>

      {/* ✅ AnimeModal sekarang menerima tipe Anime yang benar */}
      <AnimeModal anime={selectedAnime} onClose={closeModal} />

      <Footer />
    </div>
  )
}