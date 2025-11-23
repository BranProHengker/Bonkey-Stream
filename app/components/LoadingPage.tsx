"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const loadingMessages = ["Loading", "Preparing content", "Almost ready"]

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading")

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 200)

    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev)
        return loadingMessages[(currentIndex + 1) % loadingMessages.length]
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center">
      <div className="mb-12">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-6 mx-auto">
          <Image
            src="/favicon.png"
            alt="Bonkey Stream"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-3xl font-light text-white text-center mb-2">Bonkey Stream</h1>
        <p className="text-slate-400 text-sm text-center font-light">Anime Database Platform</p>
      </div>

      <div className="w-72 mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-300 text-sm font-light">{loadingText}...</span>
          <span className="text-slate-400 text-sm">{Math.round(progress)}%</span>
        </div>

        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
