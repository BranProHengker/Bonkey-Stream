"use client"

import Image from "next/image"

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-bg-dark flex flex-col items-center justify-center z-[999]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo/20 via-bg-dark/50 to-bg-dark z-0" />
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="w-24 h-24 rounded-2xl overflow-hidden mb-8 shadow-[0_0_40px_rgba(80,87,122,0.3)] animate-[bounce_2s_infinite]">
          <Image
            src="/favicon.png"
            alt="Bonkey Stream"
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <div className="flex items-center gap-2 mb-2 opacity-80">
          <div className="w-1.5 h-1.5 rounded-full bg-periwinkle animate-ping" style={{ animationDuration: '1.5s' }} />
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-periwinkle uppercase">
            Bonkey Stream
          </h1>
          <div className="w-1.5 h-1.5 rounded-full bg-periwinkle animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
        </div>
        
        <div className="flex items-center mt-6 w-32 h-1 bg-slate rounded-full overflow-hidden">
           <div className="h-full bg-periwinkle w-1/2 rounded-full animate-[spin_1.5s_linear_infinite_reverse] origin-left shadow-[0_0_10px_rgba(107,114,142,0.8)]" />
        </div>
      </div>
    </div>
  )
}
