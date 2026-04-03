import { getBatch } from "@/app/services/animeApi";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default async function BatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const batchData = await getBatch(slug);
  const batch = batchData?.data;

  if (!batch) {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center w-full text-center space-y-4">
          <div className="text-6xl opacity-50">🔍</div>
          <p className="text-xl font-medium text-periwinkle">Batch not found</p>
          <Link href="/" className="inline-block text-sm text-white hover:text-indigo-300 transition-colors bg-bg-card px-4 py-2 rounded-lg border border-white/5">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      <Navbar />
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-24 sm:py-32 max-w-7xl">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            href={`/stream/${batch.animeId}`} 
            className="inline-flex items-center gap-2 text-sm text-periwinkle hover:text-white transition-colors group font-medium"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Anime Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
          {/* Left sidebar - Poster & Info */}
          <div className="space-y-6">
            {/* Poster */}
            <div className="relative group mx-auto md:mx-0 max-w-[300px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                <Image
                  src={batch.poster}
                  alt={batch.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Info card */}
            <div className="bg-bg-card backdrop-blur-xl p-6 rounded-2xl border border-white/5 space-y-5 shadow-xl max-w-[300px] mx-auto md:mx-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-periwinkle/50 text-[10px] uppercase font-semibold tracking-wider mb-1.5 block">Title</span>
                  <span className="font-medium text-white line-clamp-2 text-sm">{batch.title}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                <div>
                  <span className="text-periwinkle/50 text-[10px] uppercase font-semibold tracking-wider mb-1.5 block">Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="font-medium text-white text-sm">{batch.score}</span>
                  </div>
                </div>
                <div>
                  <span className="text-periwinkle/50 text-[10px] uppercase font-semibold tracking-wider mb-1.5 block">Type</span>
                  <span className="font-medium text-white text-sm">{batch.type}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <span className="text-periwinkle/50 text-[10px] uppercase font-semibold tracking-wider mb-1.5 block">Duration</span>
                <span className="font-medium text-white text-sm">{batch.duration}</span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-8">
            {/* Title & Genres */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                {batch.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {batch.genreList.map((g) => (
                  <span 
                    key={g.genreId} 
                    className="px-3 py-1 bg-white/5 text-periwinkle text-xs font-medium rounded-full border border-white/5 transition-colors cursor-default"
                  >
                    {g.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Download section */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Download Batches</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              
              {batch.downloadUrl.formats.map((format, idx) => (
                <div 
                  key={idx} 
                  className="bg-bg-card backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden"
                >
                  {/* Format header */}
                  <div className="bg-white/5 px-5 sm:px-6 py-4 border-b border-white/5">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 tracking-tight">
                      <span className="w-1.5 h-1.5 bg-periwinkle rounded-full"></span>
                      {format.title}
                    </h3>
                  </div>

                  {/* Qualities */}
                  <div className="p-4 sm:p-6 space-y-3">
                    {format.qualities.map((quality, qIdx) => (
                      <div 
                        key={qIdx} 
                        className="group bg-bg-dark/30 hover:bg-bg-dark/50 border border-white/5 hover:border-white/10 rounded-xl p-4 sm:p-5 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Quality info */}
                          <div className="min-w-[140px]">
                            <span className="font-bold text-white text-sm block mb-1">
                              {quality.title}
                            </span>
                            <span className="text-xs text-periwinkle/60 font-medium">
                              {quality.size}
                            </span>
                          </div>

                          {/* Download links */}
                          <div className="flex-1 flex flex-wrap gap-2.5">
                            {quality.urls.map((link, lIdx) => (
                              <a 
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-white hover:text-bg-dark text-periwinkle text-xs font-semibold rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}