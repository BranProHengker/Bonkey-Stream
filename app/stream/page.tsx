import { searchAnime, getRecent, AnimeResult, Pagination } from "@/app/services/animeApi";
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
  let title = "Latest Updated Anime";

  if (q) {
    title = `Search Results for "${q}"`;
    const searchData = await searchAnime(q, currentPage);
    if (searchData && searchData.data) {
         results = searchData.data;
         pagination = searchData.pagination;
    }
  } else {
    // getRecent supports pagination and returns 'episodes' and 'releasedOn' fields
    const recentData = await getRecent(currentPage);
    if (recentData && recentData.data) {
        results = recentData.data;
        pagination = recentData.pagination;
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 font-sans selection:bg-indigo/80 selection:text-white">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-24 min-h-[80vh] max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-white/5 pb-4 gap-4">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white animate-fade-in-down">
                {title}
            </h1>
            <span className="text-xs text-periwinkle font-semibold bg-bg-card px-3 py-1.5 rounded border border-white/5 uppercase tracking-wider animate-fade-in-down delay-100">
                {results.length} Result{results.length !== 1 ? 's' : ''}
            </span>
        </div>
        
        {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-periwinkle/50 animate-fade-in-up">
                <svg className="w-16 h-16 opacity-20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-bold text-white mb-2">No anime found</p>
                <p className="text-sm font-light mb-6">Try checking your spelling or use different keywords.</p>
                <Link href="/stream" className="px-6 py-2.5 bg-white text-bg-dark hover:bg-slate-200 rounded font-semibold transition-colors shadow-lg text-sm">
                    Browse All
                </Link>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {results.map((anime, idx) => (
                    <Link 
                        href={`/stream/${anime.slug}`} 
                        key={idx} 
                        className="group relative flex flex-col bg-bg-card rounded-xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-500 border border-white/5 hover:border-white/10 hover:-translate-y-1"
                        style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                    >
                        <div className="relative aspect-[2/3] overflow-hidden bg-bg-dark">
                            <Image
                                src={anime.poster}
                                alt={anime.title}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out opacity-90 group-hover:opacity-100"
                                loading="lazy"
                                quality={85}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Badge Overlay */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end pointer-events-none">
                                {anime.episodes && (
                                    <span className="bg-indigo/90 backdrop-blur-xl text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg tracking-wider uppercase border border-white/20">
                                        EP {anime.episodes}
                                    </span>
                                )}
                                {(anime.status && anime.status !== 'Unknown') && !anime.episodes && (
                                    <span className="bg-white/10 backdrop-blur-xl text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg tracking-wider uppercase border border-white/10">
                                        {anime.status}
                                    </span>
                                )}
                                {anime.score && (
                                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 border border-white/10">
                                        <span className="text-yellow-400 text-xs text-shadow-sm">★</span> {anime.score}
                                    </span>
                                )}
                            </div>
                            
                            {/* Play Icon on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                                <div className="w-12 h-12 bg-white/10 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-400 ease-out">
                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-sm md:text-base text-white line-clamp-2 group-hover:text-periwinkle transition-colors mb-2 leading-snug">
                                {anime.title}
                            </h3>
                            
                            <div className="mt-auto space-y-2.5">
                                {anime.genreList && anime.genreList.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {anime.genreList.slice(0, 2).map((g, i) => (
                                            <span key={i} className="text-[9px] text-periwinkle/80 bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[80px]">
                                                {g.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] uppercase font-semibold text-periwinkle/60 tracking-wide">
                                    <div className="flex items-center truncate">
                                        <svg className="w-3.5 h-3.5 mr-1.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="truncate">{anime.releasedOn || anime.type || "TV"}</span>
                                    </div>
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
                                ? "bg-bg-card hover:bg-white hover:text-bg-dark text-white border border-white/5 hover:border-white" 
                                : "bg-bg-card text-periwinkle/30 cursor-not-allowed border border-white/5"
                            }`}
                            aria-disabled={!pagination.hasPrevPage}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </Link>
                        
                        <span className="text-periwinkle text-sm font-medium bg-bg-card px-6 py-3 rounded-xl border border-white/5 flex items-center gap-2">
                            <span className="text-white font-bold">Page {pagination.currentPage}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                            <span>{pagination.totalPages}</span>
                        </span>

                        <Link 
                            href={pagination.hasNextPage ? `/stream?${q ? `q=${q}&` : ''}page=${pagination.nextPage}` : '#'}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto justify-center ${
                                pagination.hasNextPage
                                ? "bg-bg-card hover:bg-white hover:text-bg-dark text-white border border-white/5 hover:border-white"
                                : "bg-bg-card text-periwinkle/30 cursor-not-allowed border border-white/5"
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
