"use client"

import Image from "next/image"
import { Anime } from "@/app/types/anime"

interface AnimeCardProps {
  anime: Anime
  onClick: (anime: Anime) => void
  rank?: number
}

export default function AnimeCard({ anime, onClick, rank }: AnimeCardProps) {
  return (
    <div
      className="group relative bg-bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-[600ms] ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/5 hover:border-white/10 ring-1 ring-black/5"
      onClick={() => onClick(anime)}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-bg-dark">
        <Image
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "/placeholder.svg"}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          style={{ objectFit: "cover" }}
          className="transition-transform duration-[800ms] ease-out group-hover:scale-[1.08] opacity-90 group-hover:opacity-100"
        />
        
        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-0 transition-opacity duration-500" />
        
        {/* Rank Badge */}
        {rank && (
          <div className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white font-bold text-xs shadow-lg">
            #{rank}
          </div>
        )}

        {/* Floating Genre Badge */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="absolute top-3 right-3 opacity-0 translate-y-[-10px] group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-75">
            <span className="px-2.5 py-1 bg-white/10 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg border border-white/10">
              {anime.genres[0].name}
            </span>
          </div>
        )}

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute bottom-4 right-4 flex items-center bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10 group-hover:bg-indigo/80 group-hover:border-indigo transition-colors duration-300">
             <span className="text-white text-[10px] font-bold shadow-sm">{anime.score.toFixed(1)}</span>
          </div>
        )}

        {/* Floating Content over Vignette */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <h3 className="text-white font-medium text-sm line-clamp-2 leading-tight drop-shadow-md group-hover:text-periwinkle transition-colors duration-300 mb-1.5">
            {anime.title}
          </h3>

          <div className="flex items-center gap-2 text-[10px] text-periwinkle/80 uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <span className="flex items-center">
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                anime.status === "Currently Airing" ? "bg-indigo animate-pulse" : "bg-white/40"
              }`} />
              {anime.type || "TV"}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>{anime.episodes ? `${anime.episodes} EP` : "ONG"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
