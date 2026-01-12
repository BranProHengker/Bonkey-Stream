"use client"

import { useState, useEffect } from "react"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/app/utils/storage"

interface AnimeActionsProps {
  animeSlug: string
  animeTitle: string
  animePoster: string
}

export default function AnimeActions({ animeSlug, animeTitle, animePoster }: AnimeActionsProps) {
  const [favorited, setFavorited] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setFavorited(isFavorite(animeSlug))
  }, [animeSlug])

  const handleFavorite = () => {
    if (favorited) {
      removeFromFavorites(animeSlug)
      setFavorited(false)
    } else {
      addToFavorites({ animeSlug, animeTitle, animePoster })
      setFavorited(true)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleFavorite}
        className={`px-4 py-2.5 rounded-xl text-sm transition-all border flex items-center justify-center gap-2 group ${
          favorited
            ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400"
            : "bg-slate-800 hover:bg-cyan-900/30 hover:border-cyan-500/50 text-white border-slate-700"
        }`}
      >
        <svg
          className={`w-4 h-4 transition-colors ${favorited ? "text-red-400" : "text-slate-400 group-hover:text-cyan-400"}`}
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{favorited ? "Favorited" : "Favorite"}</span>
      </button>

      <button
        onClick={handleShare}
        className="px-4 py-2.5 bg-slate-800 hover:bg-cyan-900/30 hover:border-cyan-500/50 text-white rounded-xl text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 group"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share</span>
          </>
        )}
      </button>
    </div>
  )
}
