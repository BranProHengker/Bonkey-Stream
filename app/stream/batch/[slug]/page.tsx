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
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <p className="text-xl font-medium">Batch not found</p>
          <Link href="/" className="inline-block text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <Navbar />
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-24 sm:py-32">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            href={`/stream/${batch.animeId}`} 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors group"
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
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-t from-cyan-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                <Image
                  src={batch.poster}
                  alt={batch.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>
            </div>

            {/* Info card */}
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Title</span>
                  <span className="font-semibold text-white line-clamp-2">{batch.title}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Score</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-white">{batch.score}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Type</span>
                  <span className="font-semibold text-white">{batch.type}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Duration</span>
                <span className="font-semibold text-white">{batch.duration}</span>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-8">
            {/* Title & Genres */}
            <div className="space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {batch.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {batch.genreList.map((g) => (
                  <span 
                    key={g.genreId} 
                    className="px-3.5 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/50 transition-colors cursor-default"
                  >
                    {g.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Download section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Download Batches</h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>
              </div>
              
              {batch.downloadUrl.formats.map((format, idx) => (
                <div 
                  key={idx} 
                  className="bg-linear-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-colors"
                >
                  {/* Format header */}
                  <div className="bg-linear-to-r from-slate-800/80 to-slate-800/60 px-5 sm:px-6 py-4 border-b border-slate-700/50">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      {format.title}
                    </h3>
                  </div>

                  {/* Qualities */}
                  <div className="p-4 sm:p-6 space-y-3">
                    {format.qualities.map((quality, qIdx) => (
                      <div 
                        key={qIdx} 
                        className="group bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Quality info */}
                          <div className="min-w-[140px]">
                            <span className="font-bold text-cyan-400 text-base block mb-0.5">
                              {quality.title}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {quality.size}
                            </span>
                          </div>

                          {/* Download links */}
                          <div className="flex-1 flex flex-wrap gap-2">
                            {quality.urls.map((link, lIdx) => (
                              <a 
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-all duration-300 border border-slate-700/50 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
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