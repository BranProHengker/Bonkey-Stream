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
      <div className="container mx-auto px-4 py-24 min-h-[80vh]">
        <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{title}</span>
            </h1>
            <span className="text-sm text-slate-500 font-medium">{results.length} Results</span>
        </div>
        
        {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">No anime found matching your criteria.</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((anime, idx) => (
                    <Link href={`/stream/${anime.slug}`} key={idx} className="group relative flex flex-col bg-slate-900/50 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 border border-slate-800/50 hover:border-cyan-500/30 hover:-translate-y-1">
                        <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                                src={anime.poster}
                                alt={anime.title}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            
                            {/* Badge Overlay */}
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                {(anime.status) && (
                                    <span className="bg-cyan-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                        {anime.status}
                                    </span>
                                )}
                                {anime.score && (
                                    <span className="bg-yellow-500/90 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                        ★ {anime.score}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-sm md:text-base text-slate-100 line-clamp-2 group-hover:text-cyan-400 transition-colors mb-2 leading-snug">
                                    {anime.title}
                                </h3>
                                {anime.genreList && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {anime.genreList.slice(0, 2).map((g, i) => (
                                            <span key={i} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                                {g.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {(anime.releasedOn || anime.type) && (
                                <div className="flex items-center text-[11px] text-slate-500 mt-auto pt-2 border-t border-slate-800/50">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {anime.releasedOn || anime.type}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
                </div>

                {/* Pagination Controls */}
                {pagination && (
                    <div className="flex justify-center items-center mt-12 space-x-4">
                        {pagination.hasPrevPage && (
                            <Link 
                                href={`/stream?${q ? `q=${q}&` : ''}page=${pagination.prevPage}`}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
                            >
                                &larr; Previous
                            </Link>
                        )}
                        
                        <span className="text-slate-400 text-sm font-medium bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        {pagination.hasNextPage && (
                            <Link 
                                href={`/stream?${q ? `q=${q}&` : ''}page=${pagination.nextPage}`}
                                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
                            >
                                Next &rarr;
                            </Link>
                        )}
                    </div>
                )}
            </>
        )}
      </div>
      <Footer />
    </div>
  );
}
