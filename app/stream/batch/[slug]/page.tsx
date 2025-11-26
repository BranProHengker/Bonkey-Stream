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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Batch not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-32">
        <div className="mb-8">
            <Link href={`/stream/${batch.animeId}`} className="text-cyan-400 hover:underline text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Anime Details
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
            <div className="space-y-6">
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10 ring-1 ring-white/10">
                    <Image
                        src={batch.poster}
                        alt={batch.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4 text-sm">
                    <div>
                        <span className="text-slate-500 block text-xs uppercase mb-1">Title</span>
                        <span className="font-medium text-white">{batch.title}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block text-xs uppercase mb-1">Score</span>
                        <span className="font-medium text-yellow-400">★ {batch.score}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block text-xs uppercase mb-1">Type</span>
                        <span className="font-medium text-white">{batch.type}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block text-xs uppercase mb-1">Duration</span>
                        <span className="font-medium text-white">{batch.duration}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{batch.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {batch.genreList.map((g) => (
                            <span key={g.genreId} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">
                                {g.title}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">
                        Download Batches
                    </h2>
                    
                    {batch.downloadUrl.formats.map((format, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700">
                                <h3 className="text-lg font-semibold text-white">{format.title}</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {format.qualities.map((quality, qIdx) => (
                                    <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                                        <div className="min-w-[120px]">
                                            <span className="font-bold text-cyan-400 block">{quality.title}</span>
                                            <span className="text-xs text-slate-500">{quality.size}</span>
                                        </div>
                                        <div className="flex-1 flex flex-wrap gap-2">
                                            {quality.urls.map((link, lIdx) => (
                                                <a 
                                                    key={lIdx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors border border-slate-700 hover:border-cyan-500"
                                                >
                                                    {link.title}
                                                </a>
                                            ))}
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
