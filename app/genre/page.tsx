'use client'; // Karena menggunakan useState dan useEffect

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import LoadingPage from '@/app/components/LoadingPage';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function GenrePage() {
  const [genres, setGenres] = useState([]); // State untuk menyimpan daftar genre
  const [selectedGenre, setSelectedGenre] = useState(null); // State untuk genre yang dipilih
  const [animeByGenre, setAnimeByGenre] = useState([]); // State untuk anime berdasarkan genre
  const [selectedAnime, setSelectedAnime] = useState(null); // State untuk anime yang dipilih (untuk modal)

  // Fetch daftar genre dari Jikan API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/genres/anime');
        const data = await response.json();
        setGenres(data.data || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch anime berdasarkan genre yang dipilih
  const fetchAnimeByGenre = async (genreId) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreId}`);
      const data = await response.json();
      setAnimeByGenre(data.data || []);
    } catch (error) {
      console.error('Error fetching anime by genre:', error);
      setAnimeByGenre([]);
    }
  };

  // Handle klik genre
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    fetchAnimeByGenre(genreId);
  };

  // Handle klik anime untuk membuka modal detail
  const openModal = (anime) => {
    setSelectedAnime(anime); // Set anime yang dipilih ke state
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedAnime(null); // Reset state anime yang dipilih
  };

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-70 sm:h-100 overflow-hidden">
        <Image
          src="/go-toubun-no-hanayome.jpg" // Ganti dengan URL gambar hero online
          alt="Nakano Itsuki"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-65"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Choose The Genre
          </h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-300 drop-shadow-md">
           Just enjoy the display of this anime streaming website which doesn't stream just data on amine.
          </p>
        </div>
      </section>

      {/* Genre List Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">List Genre</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {genres.map((genre) => (
              <button
                key={genre.mal_id}
                onClick={() => handleGenreClick(genre.mal_id)}
                className={`px-4 py-2 rounded-full text-sm sm:text-base ${
                  selectedGenre === genre.mal_id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                } hover:bg-blue-700 transition duration-300`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Anime by Genre Section */}
      {selectedGenre && (
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Based On Genre</h2>
            {animeByGenre.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {animeByGenre.map((anime) => (
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
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 sm:p-4">
                      <h3 className="text-sm sm:text-lg font-semibold text-white">{anime.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-400 text-center">
                It's nothing Anime what your looking for .
              </p>
            )}
          </div>
        </section>
      )}

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
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-400 z-10"
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
                  width={300}
                  height={450}
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