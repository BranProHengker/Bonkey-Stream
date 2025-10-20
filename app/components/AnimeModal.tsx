import Image from "next/image";

// Definisikan tipe langsung di sini
interface AnimeGenre {
  mal_id: number;
  name: string;
}

interface AnimeImages {
  jpg: {
    image_url: string;
    large_image_url: string;
  };
}

interface AnimeAired {
  string: string;
}

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: AnimeImages;
  synopsis: string;
  type: string;
  episodes: number | null;
  status: string;
  score: number | null;
  rating: string;
  genres: AnimeGenre[];
  aired: AnimeAired;
}

interface AnimeModalProps {
  anime: Anime | null;
  onClose: () => void;
}

export default function AnimeModal({ anime, onClose }: AnimeModalProps) {
  if (!anime) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
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
              src={anime.images.jpg.large_image_url || "/placeholder.svg"}
              alt={anime.title}
              width={300}
              height={400}
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{anime.title}</h2>

            {anime.title_english && anime.title_english !== anime.title && (
              <p className="text-slate-400">{anime.title_english}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold text-blue-400">Type:</span>
                <span className="ml-2 text-gray-300">{anime.type}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Episodes:</span>
                <span className="ml-2 text-gray-300">{anime.episodes || "Unknown"}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Status:</span>
                <span className="ml-2 text-gray-300">{anime.status}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Score:</span>
                <span className="ml-2 text-gray-300">{anime.score || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Aired:</span>
                <span className="ml-2 text-gray-300">{anime.aired?.string || "Unknown"}</span>
              </div>
              <div>
                <span className="font-bold text-blue-400">Rating:</span>
                <span className="ml-2 text-gray-300">{anime.rating || "Not available"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-blue-400">Synopsis:</p>
              <div className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto bg-gray-800 p-4 rounded-lg">
                {anime.synopsis || "No synopsis available"}
              </div>
            </div>

            {anime.genres && anime.genres.length > 0 && (
              <div className="space-y-2">
                <p className="font-bold text-blue-400">Genres:</p>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span key={genre.mal_id} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
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
  );
}