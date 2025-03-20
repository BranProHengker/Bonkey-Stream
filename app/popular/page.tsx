'use client'; // Karena menggunakan useState dan useEffect
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingPage from '@/app/components/LoadingPage';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [popularAnime, setPopularAnime] = useState([]); // State untuk menyimpan anime populer
  const [loadingPopular, setLoadingPopular] = useState(true); // State untuk loading indicator anime populer
  const [selectedAnime, setSelectedAnime] = useState(null); // State untuk menyimpan anime yang dipilih (untuk modal)

  // Fungsi untuk mengambil data anime populer dari Jikan API
  const fetchPopularAnime = async () => {
    setLoadingPopular(true);
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime');
      const data = await response.json();
      setPopularAnime(data.data || []); // Simpan hasil ke state
    } catch (error) {
      console.error('Error fetching popular anime:', error);
      setPopularAnime([]);
    } finally {
      setLoadingPopular(false);
    }
  };

  // Panggil API saat komponen dimuat
  useEffect(() => {
    fetchPopularAnime();
  }, []);

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
            Popular Anime Right Now
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-300 drop-shadow-md">
            Just enjoy the display of this anime streaming website which doesn't stream just displays it.
          </p>
        </div>
      </section>

      {/* Popular Anime Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Anime Populer</h2>
          {loadingPopular ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
              </div>
              <p className="mt-4 text-gray-400">Memuat anime populer...</p>
            </div>
          ) : popularAnime.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {popularAnime.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => openModal(anime)} // Buka modal saat anime diklik
                >
                  <Image
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    width={300}
                    height={450}
                    className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 sm:p-4">
                    <h3 className="text-sm sm:text-lg font-semibold text-white">{anime.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-400">Tidak ada anime populer ditemukan.</p>
          )}
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
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-gray-400 z-10"
              style={{ zIndex: 10 }} // Pastikan tombol exit berada di atas konten lain
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 sm:w-10 sm:h-10" // Ukuran tombol lebih besar untuk mobile
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Konten Modal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Poster */}
              <div className="flex justify-center">
                <Image
                  src={selectedAnime.images.jpg.large_image_url}
                  alt={selectedAnime.title}
                  width={215}
                  height={250}
                  className="rounded-lg shadow-lg max-w-full sm:max-w-[300px] md:max-w-[400px] h-auto"
                />
              </div>

              {/* Informasi Anime */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedAnime.title}</h2>
                <p>
                  <span className="font-bold">Tipe:</span> {selectedAnime.type}
                </p>
                <p>
                  <span className="font-bold">Episode:</span> {selectedAnime.episodes || 'Tidak diketahui'}
                </p>
                <p>
                  <span className="font-bold">Status:</span> {selectedAnime.status}
                </p>
                <p>
                  <span className="font-bold">Tanggal Rilis:</span> {selectedAnime.aired?.string || 'Tidak diketahui'}
                </p>
                <p>
                  <span className="font-bold">Rating:</span> {selectedAnime.rating || 'Tidak tersedia'}
                </p>
                <div className="space-y-2">
                  <p className="font-bold">Sinopsis:</p>
                  <div className="text-gray-300 overflow-y-auto max-h-[200px]">
                    {selectedAnime.synopsis || 'Tidak tersedia'}
                  </div>
                </div>
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