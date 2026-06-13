"use client"

import Image from "next/image"

import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-bg-dark text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-7xl w-full">
        {/* Skeleton Header Area */}
        <div className="w-48 h-10 bg-white/5 rounded-lg animate-pulse mb-8 mt-4 md:mt-8"></div>
        
        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full aspect-[2/3] bg-white/5 rounded-xl animate-pulse"></div>
              <div className="flex flex-col gap-2 px-1">
                <div className="w-[85%] h-4 bg-white/5 rounded animate-pulse"></div>
                <div className="w-[50%] h-3 bg-white/5 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
