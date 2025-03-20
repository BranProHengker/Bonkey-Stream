'use client'; // Karena menggunakan useState
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState(''); // State untuk menyimpan kata kunci pencarian
  const [searchResults, setSearchResults] = useState([]); // State untuk menyimpan hasil pencarian
  const [loading, setLoading] = useState(false); // State untuk loading indicator
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State untuk menampilkan/sembunyikan input field
  const [selectedAnime, setSelectedAnime] = useState(null); // State untuk anime yang dipilih (untuk modal)

  // Fungsi untuk melakukan pencarian anime menggunakan Jikan API
  const handleSearch = async () => {
    if (!query.trim()) return; // Jika query kosong, tidak melakukan apa-apa
    setLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data.data || []); // Simpan hasil pencarian ke state
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk membuka modal detail anime
  const openModal = (anime) => {
    setSelectedAnime(anime); // Set anime yang dipilih ke state
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setSelectedAnime(null); // Reset state anime yang dipilih
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          {/* Logo */}
          <a href="/home">
          <h1 className="hover:text-blue-400 text-xl sm:text-2xl font-bold mb-4 sm:mb-0">
            Bonkey Stream
            </h1></a>

          {/* Menu Navigasi */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a
              href="/home"
              className="text-white hover:text-gray-500 transition-all duration-300"
            >
              Home
            </a>
            <a
              href="/genre"
              className="text-white hover:text-gray-500 transition-all duration-300"
            >
              Genre
            </a>
            <a
              href="/popular"
              className="text-white hover:text-gray-500 transition-all duration-300"
            >
              Popular
            </a>
            <a
              href="https://github.com/BranProHengker" // Link About diarahkan ke GitHub
              target="_blank" // Membuka link di tab baru
              rel="noopener noreferrer" // Untuk keamanan saat membuka link di tab baru
              className="text-white hover:text-gray-300 transition-all duration-500"
            >
              About
            </a>

            {/* Tombol Search */}
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="text-white hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>

            {/* Input Pencarian */}
            {isSearchVisible && (
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <input
                  type="text"
                  placeholder="Cari anime..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-3 py-1 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-1 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300"
                >
                  Cari
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Menampilkan Hasil Pencarian */}
      {isSearchVisible && query && (
        <section className="py-8 sm:py-12 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Hasil Pencarian</h2>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
                </div>
                <p className="mt-4 text-gray-400">Memuat hasil...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {searchResults.map((anime) => (
                  <div
                    key={anime.mal_id}
                    className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                    onClick={() => openModal(anime)} // Buka modal saat anime diklik
                  >
                    <img
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      className="w-full h-100 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 sm:p-4">
                      <h3 className="text-sm sm:text-lg font-semibold text-white">{anime.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-400">Tidak ada hasil ditemukan.</p>
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
                <img
                  src={selectedAnime.images.jpg.large_image_url}
                  alt={selectedAnime.title}
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
    </>
  );
}