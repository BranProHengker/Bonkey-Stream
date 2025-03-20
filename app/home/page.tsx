'use client'; // Tambahkan ini karena kita menggunakan useState dan useEffect

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingPage from '@/app/components/LoadingPage';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [query, setQuery] = useState(''); // State untuk menyimpan kata kunci pencarian
  const [loading, setLoading] = useState(false); // State untuk loading indicator
  const [selectedAnime, setSelectedAnime] = useState(null); // State untuk anime yang dipilih (untuk modal)

  // Data anime populer dengan URL gambar online
  const popularAnime = [
    {
      id: 1,
      title: 'Jojo Bizarre Adventure Part 1',
      image: 'https://i.pinimg.com/736x/79/35/bb/7935bbd1a97632a4e9ec89f6003b6626.jpg',
    },
    {
      id: 2,
      title: 'Haikyu!!',
      image: 'https://i.pinimg.com/736x/16/c4/d8/16c4d8585d422655eae9948cd5e5bc01.jpg',
    },
    {
      id: 3,
      title: 'Attack on Titan',
      image: 'https://i.pinimg.com/736x/d6/db/56/d6db56701eb303d9dd3cddab3afb4701.jpg',
    },
    {
      id: 4,
      title: 'Quintessential Quintuplets',
      image: 'https://i.pinimg.com/736x/60/cc/eb/60cceb5c3b61ccd50f61ce11b584dd2e.jpg',
    },
  ];

  // LOADING FUNCTION
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulasi loading selama 2 detik
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  // Fungsi untuk membuka modal detail anime
  const openModal = (anime) => {
    setSelectedAnime(anime); // Set anime yang dipilih ke state
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedAnime(null); // Reset state anime yang dipilih
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/a1/36/dc/a136dcbc249237d7b643aa5fc03a7e7e.jpg" // Ganti dengan URL gambar hero online
          alt="Hero Anime"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-70"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Streaming Anime Terbaik
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-300 drop-shadow-md">
            Just enjoy the display of this anime streaming website which doesn't stream just displays it.
          </p>
        </div>
      </section>

      {/* Popular Anime Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">You Must Watch This Anime</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularAnime.map((anime) => (
              <div
                key={anime.id}
                className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openModal(anime)} // Buka modal saat anime diklik
              >
                <Image
                  src={anime.image}
                  alt={anime.title}
                  width={300}
                  height={450}
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 sm:p-4">
                  <h3 className="text-sm sm:text-lg font-semibold text-white">{anime.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Detail Anime */}
      {selectedAnime && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 ${
            selectedAnime ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-3xl relative">
            {/* Tombol Close Modal */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-400"
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

            {/* Konten Modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Poster */}
              <div className="flex justify-center">
                <Image
                  src={selectedAnime.image}
                  alt={selectedAnime.title}
                  width={300}
                  height={450}
                  className="rounded-lg shadow-lg"
                />
              </div>

              {/* Informasi Anime */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedAnime.title}</h2>
                <p>
                  <span className="font-bold">—</span> {selectedAnime.id}
                </p>
                <p>
                  <span className="font-bold">Description:</span> Just Example
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}