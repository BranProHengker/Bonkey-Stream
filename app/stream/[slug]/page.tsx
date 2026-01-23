import { getAnimeDetail } from "@/app/services/animeApi";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AnimeActions from "@/app/components/AnimeActions";
import Image from "next/image";
import Link from "next/link";

export default async function StreamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detailData = await getAnimeDetail(slug);
  const anime = detailData?.data;

  if (!anime) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Anime not found.</p>
      </div>
    );
  }

  const displayDetails = {
    "Japanese Title": anime.japanese_title,
    "Type": anime.type,
    "Status": anime.status,
    "Episodes": anime.episode_count,
    "Duration": anime.duration,
    "Date Aired": anime.aired,
    "Studio": anime.studios,
    "Rating": anime.rating,
    "Producer": anime.producers,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      <div className="relative min-h-[60vh] w-full flex items-end pb-12 pt-32 overflow-hidden">
        <Image
            src={anime.poster}
            alt={anime.title}
            fill
            priority
            className="object-cover opacity-20 blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
        
        <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 items-start">
            <div className="relative aspect-[2/3] w-full md:w-[300px] rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 ring-1 ring-white/10 mx-auto md:mx-0">
                <Image 
                    src={anime.poster} 
                    alt={anime.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>
            
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                        {anime.title}
                    </h1>
                    {anime.japanese_title && (
                        <p className="text-xl text-slate-400 font-light">{anime.japanese_title}</p>
                    )}
                </div>

                {anime.genres && (
                    <div className="flex flex-wrap gap-2">
                        {anime.genres.map((g) => (
                            <span key={g.genreId} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-cyan-300 transition-colors cursor-default">
                                {g.title}
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 text-sm bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    {Object.entries(displayDetails).map(([key, value]) => (
                        value && (
                            <div key={key} className="space-y-1">
                                <span className="text-slate-500 font-medium block text-xs uppercase tracking-wider">{key}</span>
                                <span className="text-slate-200 font-medium">{value}</span>
                            </div>
                        )
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <AnimeActions 
                        animeSlug={slug}
                        animeTitle={anime.title}
                        animePoster={anime.poster}
                    />
                    {anime.batch && (
                        <Link 
                            href={`/stream/batch/${anime.batch.batchId}`}
                            className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Batch
                        </Link>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-1 h-8 bg-cyan-500 rounded-full mr-3"></span>
                        Synopsis
                    </h2>
                    <div className="text-slate-300 leading-relaxed text-lg space-y-4">
                        {anime.synopsis ? (
                            <p>{anime.synopsis}</p>
                        ) : (
                            <p className="text-slate-500 italic">No synopsis available.</p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-1 h-8 bg-cyan-500 rounded-full mr-3"></span>
                        Daftar Episode
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {anime.episode_lists?.map((ep) => (
                            <Link
                                href={`/stream/watch/${ep.slug}`}
                                key={ep.slug}
                                className="flex items-center p-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 rounded-xl transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-cyan-500 font-bold group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                    {ep.title}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-white truncate transition-colors">
                                        Watch Now
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {anime.aired ? `Released: ${anime.aired}` : 'Release date unknown'} • {anime.status || 'Status unknown'}
                                    </p>
                                </div>
                                <div className="ml-2 text-slate-600 group-hover:text-cyan-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
            
            <div className="space-y-8">
                {/* Sidebar Content (Optional: Related Anime, etc) */}
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
