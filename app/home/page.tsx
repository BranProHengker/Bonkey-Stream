"use client"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import LoadingPage from "@/app/components/LoadingPage"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState(null)

  const popularAnime = [
    {
      id: 1,
      title: "Jojo Bizarre Adventure Part 1",
      image: "https://i.pinimg.com/736x/79/35/bb/7935bbd1a97632a4e9ec89f6003b6626.jpg",
    },
    {
      id: 2,
      title: "Haikyu!!",
      image: "https://i.pinimg.com/736x/16/c4/d8/16c4d8585d422655eae9948cd5e5bc01.jpg",
    },
    {
      id: 3,
      title: "Attack on Titan",
      image: "https://i.pinimg.com/736x/d6/db/56/d6db56701eb303d9dd3cddab3afb4701.jpg",
    },
    {
      id: 4,
      title: "Quintessential Quintuplets",
      image: "https://i.pinimg.com/736x/60/cc/eb/60cceb5c3b61ccd50f61ce11b584dd2e.jpg",
    },
  ]

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
            {popularAnime.map((anime) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {anime.title}
                  </h3>
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
                    <p className="text-gray-300">
                      <span className="font-bold">ID:</span> {selectedAnime.id}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-white">Description</h3>
                    <p className="text-gray-300 leading-relaxed">Just Example.</p>
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
