  import Image from "next/image";
import { Anime } from "@/app/types/anime";

interface AnimeModalProps {
  anime: Anime | null;
  onClose: () => void;
}

export default function AnimeModal({ anime, onClose }: AnimeModalProps) {
  if (!anime) return null;

  const bgImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6 transition-all duration-300">
      
      {/* Click outside to close (Optional invisible overlay) */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-bg-dark border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5 animate-fade-in-up flex flex-col">
        
        {/* Absolute Background Image (Blurred heavily for atmosphere) */}
        {bgImage && (
           <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
             <Image 
                src={bgImage} 
                alt="Background" 
                fill 
                className="object-cover blur-3xl scale-110 saturate-150" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/80 to-transparent" />
           </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 z-20 bg-black/40 hover:bg-white hover:text-black rounded-full p-2.5 transition-all duration-300 backdrop-blur-md border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content Area */}
        <div className="relative z-10 flex flex-col md:flex-row overflow-y-auto custom-scrollbar h-full">
            
          {/* Left Side: Poster (Sticky) */}
          <div className="md:w-[40%] p-6 md:p-10 shrink-0 relative flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-white/5">
             <div className="relative w-full aspect-[2/3] max-w-[300px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 mx-auto">
               <Image
                 src={bgImage || "/placeholder.svg"}
                 alt={anime.title}
                 fill
                 sizes="(max-width: 768px) 100vw, 300px"
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
               
               {/* Score floating on poster */}
               {anime.score && (
                 <div className="absolute bottom-4 right-4 bg-indigo text-white font-bold text-sm px-2.5 py-1 rounded shadow-lg">
                    ★ {anime.score.toFixed(1)}
                 </div>
               )}
             </div>

             {/* Action Button */}
             <div className="mt-8 w-full max-w-[300px]">
                <a 
                  href={`/stream?q=${encodeURIComponent(anime.title)}`}
                  className="group relative flex items-center justify-center w-full py-4 px-6 bg-white hover:bg-slate-200 text-bg-dark font-bold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </a>
             </div>
          </div>

          {/* Right Side: Details */}
          <div className="md:w-[60%] p-6 md:p-10 flex flex-col">
            <div className="mb-2">
               {anime.title_english && anime.title_english !== anime.title && (
                 <h3 className="text-periwinkle text-xs font-semibold tracking-[0.15em] uppercase mb-2">
                   {anime.title_english}
                 </h3>
               )}
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                 {anime.title}
               </h2>
               
               {/* Meta Row */}
               <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-periwinkle uppercase tracking-wider mb-8">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/5 rounded">
                     <span className={`w-1.5 h-1.5 rounded-full ${anime.status === 'Currently Airing' ? 'bg-indigo animate-pulse' : 'bg-white/40'}`} />
                     {anime.status}
                  </span>
                  <span>{anime.type}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{anime.episodes ? `${anime.episodes} Episodes` : "Ongoing"}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{anime.aired?.string?.split(' to ')[0] || "Unknown"}</span>
                  {anime.rating && (
                     <>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="border border-periwinkle/30 px-1.5 py-0.5 rounded text-[10px]">{anime.rating.split('-')[0].trim()}</span>
                     </>
                  )}
               </div>
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h4 className="text-white text-sm font-semibold mb-3">Synopsis</h4>
              <p className="text-periwinkle/90 text-sm md:text-base leading-relaxed font-light">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mt-auto pt-8 border-t border-white/5">
                <h4 className="text-white text-sm font-semibold mb-3">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span key={genre.mal_id} className="px-3 py-1.5 bg-black/40 border border-white/10 text-periwinkle text-xs font-medium rounded-lg hover:text-white hover:border-white/30 transition-colors cursor-default">
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
