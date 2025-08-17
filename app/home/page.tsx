"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import { useState, useEffect } from "react"
import Image from "next/image"

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

interface Anime {
  mal_id: number
  title: string
  images: AnimeImages
  synopsis: string
  type: string
  episodes: number | null
  status: string
  score: number | null
  year: number | null
  genres: AnimeGenre[]
}

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [recommendedAnime, setRecommendedAnime] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendedAnime = async () => {
      try {
        setIsLoading(true)
        const animeNames = [
          "Berserk",
          "Josee to Tora to Sakana-tachi", // Josee, the Tiger and the Fish
          "Koe no Katachi", // Silent Voice
          "JoJo no Kimyou na Bouken", // JoJo's Bizarre Adventure
        ]

        const animePromises = animeNames.map(async (name, index) => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 2000 + index * 1000))
            console.log(`[v0] Fetching anime: ${name}`)
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(name)}&limit=1`)

            if (!response.ok) {
              console.error(`[v0] Failed to fetch ${name}: ${response.status}`)
              return null
            }

            const data = await response.json()

            if (data && data.data && data.data.length > 0) {
              console.log(`[v0] Successfully found: ${data.data[0].title}`)
              return data.data[0]
            } else {
              console.error(`[v0] No results found for ${name}`)
              return null
            }
          } catch (error) {
            console.error(`[v0] Error fetching ${name}:`, error)
            return null
          }
        })

        const results = await Promise.all(animePromises)
        const validResults = results.filter((anime): anime is Anime => anime !== null)

        if (validResults.length === 0) {
          console.warn("[v0] No anime found from API, using fallback data")
          const fallbackData: Anime[] = [
            {
              mal_id: 1,
              title: "Berserk",
              images: {
                jpg: {
                  image_url: "/placeholder.svg?height=400&width=300",
                  large_image_url: "/placeholder.svg?height=400&width=300",
                },
              },
              synopsis: "A dark fantasy anime following Guts, a lone warrior.",
              type: "TV",
              episodes: 25,
              status: "Finished Airing",
              score: 8.7,
              year: 1997,
              genres: [
                { mal_id: 1, name: "Action" },
                { mal_id: 2, name: "Drama" },
              ],
            },
            {
              mal_id: 2,
              title: "Josee to Tora to Sakana-tachi",
              images: {
                jpg: {
                  image_url: "/placeholder.svg?height=400&width=300",
                  large_image_url: "/placeholder.svg?height=400&width=300",
                },
              },
              synopsis:
                "A heartwarming story about a disabled girl named Josee and a university student who helps her explore the world.",
              type: "Movie",
              episodes: 1,
              status: "Finished Airing",
              score: 8.2,
              year: 2020,
              genres: [
                { mal_id: 8, name: "Romance" },
                { mal_id: 9, name: "Drama" },
              ],
            },
            {
              mal_id: 3,
              title: "Koe no Katachi",
              images: {
                jpg: {
                  image_url: "/placeholder.svg?height=400&width=300",
                  large_image_url: "/placeholder.svg?height=400&width=300",
                },
              },
              synopsis: "A story about redemption and the consequences of bullying.",
              type: "Movie",
              episodes: 1,
              status: "Finished Airing",
              score: 8.9,
              year: 2016,
              genres: [
                { mal_id: 5, name: "Drama" },
                { mal_id: 6, name: "School" },
              ],
            },
            {
              mal_id: 4,
              title: "JoJo no Kimyou na Bouken",
              images: {
                jpg: {
                  image_url: "/placeholder.svg?height=400&width=300",
                  large_image_url: "/placeholder.svg?height=400&width=300",
                },
              },
              synopsis: "The bizarre adventures of the Joestar family across generations.",
              type: "TV",
              episodes: 26,
              status: "Finished Airing",
              score: 8.5,
              year: 2012,
              genres: [
                { mal_id: 7, name: "Action" },
                { mal_id: 8, name: "Adventure" },
              ],
            },
          ]
          setRecommendedAnime(fallbackData)
        } else {
          console.log(`[v0] Successfully loaded ${validResults.length} anime from API`)
          setRecommendedAnime(validResults)
        }

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

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Recommendations</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
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

      <section className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
        <Image src="/my-kanojo-2.jpg" alt="Nakano Itsuki" fill style={{ objectFit: "cover" }} className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">Database anime</h2>
          <p className="max-w-2xl text-lg sm:text-xl text-gray-200 mb-8 drop-shadow-md leading-relaxed">
            Just enjoy the display of this anime streaming website which doesn't stream just data on anime.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">You Must Watch This Anime</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedAnime.map((anime) => (
              <div
                key={anime.mal_id}
                className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                onClick={() => openModal(anime)}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "/placeholder.svg"}
                    alt={anime.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        {anime.genres[0].name}
                      </span>
                    </div>
                  )}
                  {anime.score && (
                    <div className="absolute top-3 right-3 flex items-center bg-black/70 px-2 py-1 rounded">
                      <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-xs font-medium">{anime.score}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {anime.title}
                  </h3>
                  {anime.genres && anime.genres.length > 1 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {anime.genres.slice(1, 3).map((genre) => (
                        <span key={genre.mal_id} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                      src={
                        selectedAnime.images?.jpg?.large_image_url ||
                        selectedAnime.images?.jpg?.image_url ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
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
                        <span className="font-bold">Score:</span> {selectedAnime.score || "N/A"}
                      </p>
                      <p>
                        <span className="font-bold">Year:</span> {selectedAnime.year || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedAnime.synopsis || "No synopsis available."}
                    </p>
                  </div>

                  {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-white">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnime.genres.map((genre) => (
                          <span key={genre.mal_id} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
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
        </div>
      )}

      <Footer />
    </div>
  )
}
