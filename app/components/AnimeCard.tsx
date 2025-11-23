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
      className="group relative bg-slate-800/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 border border-white/5 hover:border-cyan-500/50"
      onClick={() => onClick(anime)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "/placeholder.svg"}
          alt={anime.title}
          fill
          style={{ objectFit: "cover" }}
          className="transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
        
        {/* Rank Badge (if provided) */}
        {rank && (
          <div className={`absolute top-0 left-0 px-4 py-2 rounded-br-2xl font-bold text-white z-10 ${
            rank === 1 ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/20" :
            rank === 2 ? "bg-gradient-to-r from-slate-300 to-slate-500 shadow-lg shadow-slate-400/20" :
            rank === 3 ? "bg-gradient-to-r from-orange-700 to-orange-900 shadow-lg shadow-orange-800/20" :
            "bg-slate-800/80 backdrop-blur-md border-r border-b border-white/10"
          }`}>
            #{rank}
          </div>
        )}

        {/* Floating Genre Badge */}
        {anime.genres && anime.genres.length > 0 && (
          <div className="absolute top-3 right-3 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            <span className="px-2.5 py-1 bg-cyan-500/80 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-500/20 border border-white/20">
              {anime.genres[0].name}
            </span>
          </div>
        )}

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute bottom-3 right-3 flex items-center bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-colors duration-300">
            <svg className="w-3.5 h-3.5 text-yellow-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-sm font-bold">{anime.score}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 relative">
        {/* Glow Effect behind text */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative text-white font-semibold line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300 mb-2">
          {anime.title}
        </h3>

        {/* Meta Info */}
        <div className="relative flex justify-between items-center text-xs text-slate-400 border-t border-white/5 pt-3 mt-1">
          <span className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              anime.status === "Currently Airing" ? "bg-green-500 animate-pulse" : "bg-slate-600"
            }`} />
            {anime.type || "TV"}
          </span>
          <span>{anime.episodes ? `${anime.episodes} eps` : "Ongoing"}</span>
        </div>
      </div>
    </div>
  )
}
