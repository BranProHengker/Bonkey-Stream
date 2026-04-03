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
      <div className="min-h-screen bg-bg-dark text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-bg-dark text-white">
      <Navbar />
      
      <div className="relative min-h-[60vh] w-full flex items-end pb-12 pt-32 overflow-hidden">
        <Image
            src={anime.poster}
            alt={anime.title}
            fill
            priority
            className="object-cover opacity-10 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 via-bg-dark/80 to-bg-dark" />
        
        <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 items-start max-w-7xl">
            <div className="relative aspect-[2/3] w-full md:w-[300px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 mx-auto md:mx-0">
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
                        <p className="text-xl text-periwinkle font-light">{anime.japanese_title}</p>
                    )}
                </div>

                {anime.genres && (
                    <div className="flex flex-wrap gap-2">
                        {anime.genres.map((g) => (
                            <span key={g.genreId} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-periwinkle transition-colors cursor-default backdrop-blur-md">
                                {g.title}
                            </span>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 text-sm bg-bg-card p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    {Object.entries(displayDetails).map(([key, value]) => (
                        value && (
                            <div key={key} className="space-y-1">
                                <span className="text-periwinkle/50 font-semibold block text-[10px] uppercase tracking-wider">{key}</span>
                                <span className="text-white font-medium">{value}</span>
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
                            className="inline-flex items-center px-6 py-2.5 bg-white hover:bg-slate-200 text-bg-dark font-bold rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
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

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-1.5 h-8 bg-indigo rounded-full mr-3"></span>
                        Synopsis
                    </h2>
                    <div className="text-periwinkle leading-relaxed text-base space-y-4 font-light">
                        {anime.synopsis ? (
                            <p>{anime.synopsis}</p>
                        ) : (
                            <p className="opacity-50 italic">No synopsis available.</p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-1.5 h-8 bg-indigo rounded-full mr-3"></span>
                        Daftar Episode
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {anime.episode_lists?.map((ep) => (
                            <Link
                                href={`/stream/watch/${ep.slug}`}
                                key={ep.slug}
                                className="flex items-center p-4 bg-bg-card hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl transition-all duration-300 group hover:-translate-y-0.5"
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-white group-hover:text-bg-dark transition-colors border border-white/5 group-hover:border-transparent">
                                    {ep.title}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-white group-hover:text-periwinkle truncate transition-colors">
                                        Watch Now
                                    </h4>
                                    <p className="text-xs text-periwinkle/50 mt-0.5 font-light">
                                        {anime.aired ? `Released: ${anime.aired}` : 'Release date unknown'} • {anime.status || 'Status unknown'}
                                    </p>
                                </div>
                                <div className="ml-2 text-periwinkle/30 group-hover:text-white transition-colors">
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
