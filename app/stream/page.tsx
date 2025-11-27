import { searchAnime, getOngoing, AnimeResult, Pagination } from "@/app/services/animeApi";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default async function StreamPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Number(page) || 1;
  let results: AnimeResult[] = [];
  let pagination: Pagination | undefined;
  let title = "Ongoing Anime";

  if (q) {
    title = `Search Results for "${q}"`;
    const searchData = await searchAnime(q, currentPage);
    if (searchData && searchData.data) {
         results = searchData.data;
         pagination = searchData.pagination;
    }
  } else {
    const ongoingData = await getOngoing(currentPage);
    if (ongoingData && ongoingData.data) {
        results = ongoingData.data;
        pagination = ongoingData.pagination;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-24 min-h-[80vh]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 border-b border-slate-800 pb-4 gap-4">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white animate-fade-in-down">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{title}</span>
            </h1>
            <span className="text-sm text-slate-500 font-medium bg-slate-900 px-3 py-1 rounded-full border border-slate-800 animate-fade-in-down delay-100">
                {results.length} Result{results.length !== 1 ? 's' : ''}
            </span>
        </div>
        
        {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500 animate-fade-in-up">
                <div className="bg-slate-900 p-6 rounded-full mb-6 border border-slate-800 shadow-lg shadow-cyan-900/10">
                    <svg className="w-16 h-16 opacity-50 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-xl font-medium text-slate-400">No anime found matching your criteria.</p>
                <p className="text-sm mt-2">Try checking your spelling or use different keywords.</p>
                <Link href="/stream" className="mt-6 px-6 py-2 bg-slate-800 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm">
                    Browse All
                </Link>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                {results.map((anime, idx) => (
                    <Link 
                        href={`/stream/${anime.slug}`} 
                        key={idx} 
                        className="group relative flex flex-col bg-slate-900/50 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 border border-slate-800/50 hover:border-cyan-500/30 hover:-translate-y-1 animate-fade-in-up"
                        style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
                            <Image
                                src={anime.poster}
                                alt={anime.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                            
                            {/* Badge Overlay */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end pointer-events-none">
                                {(anime.status && anime.status !== 'Unknown') && (
                                    <span className="bg-cyan-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg tracking-wide uppercase">
                                        {anime.status}
                                    </span>
                                )}
                                {anime.score && (
                                    <span className="bg-yellow-500/90 backdrop-blur-md text-black text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg flex items-center gap-1">
                                        <span className="text-xs">★</span> {anime.score}
                                    </span>
                                )}
                            </div>
                            
                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-sm md:text-base text-slate-100 line-clamp-2 group-hover:text-cyan-400 transition-colors mb-2 leading-snug">
                                {anime.title}
                            </h3>
                            
                            <div className="mt-auto space-y-2">
                                {anime.genreList && anime.genreList.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {anime.genreList.slice(0, 2).map((g, i) => (
                                            <span key={i} className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 truncate max-w-[80px]">
                                                {g.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-[11px] text-slate-500">
                                    <div className="flex items-center truncate">
                                        <svg className="w-3 h-3 mr-1 text-cyan-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{anime.releasedOn || anime.type || "TV"}</span>
                                    </div>
                                    {anime.source === 'kuramanime' && (
                                        <span className="text-xs text-cyan-600/50 font-mono">KURA</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                </div>

                {/* Pagination Controls */}
                {pagination && (
                    <div className="flex flex-col sm:flex-row justify-center items-center mt-16 gap-4 animate-fade-in-up delay-200">
                        <Link 
                            href={pagination.hasPrevPage ? `/stream?${q ? `q=${q}&` : ''}page=${pagination.prevPage}` : '#'}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto justify-center ${
                                pagination.hasPrevPage 
                                ? "bg-slate-800 hover:bg-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/20" 
                                : "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                            }`}
                            aria-disabled={!pagination.hasPrevPage}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </Link>
                        
                        <span className="text-slate-400 text-sm font-medium bg-slate-900 px-6 py-3 rounded-xl border border-slate-800 flex items-center gap-2 shadow-inner">
                            <span className="text-cyan-400">Page {pagination.currentPage}</span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                            <span>{pagination.totalPages}</span>
                        </span>

                        <Link 
                            href={pagination.hasNextPage ? `/stream?${q ? `q=${q}&` : ''}page=${pagination.nextPage}` : '#'}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto justify-center ${
                                pagination.hasNextPage
                                ? "bg-slate-800 hover:bg-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/20"
                                : "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                            }`}
                            aria-disabled={!pagination.hasNextPage}
                        >
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </>
        )}
      </div>
      <Footer />
    </div>
  );
}
