"use client"

import { getEpisode, EpisodeDetail } from "@/app/services/animeApi";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingPage from "@/app/components/LoadingPage";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [currentServer, setCurrentServer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
        setSlug(resolvedParams.slug);
        getEpisode(resolvedParams.slug).then((data) => {
            if (data?.data) {
                setEpisode(data.data);
                setCurrentServer(data.data.stream_url);
            }
            setLoading(false);
        }); 
    });
  }, [params]);

  const handleServerChange = async (serverId: string) => {
      // If serverId is a URL (for Kuramanime), set it directly
      if (serverId.startsWith('http')) {
          setCurrentServer(serverId);
          return;
      }

      setLoading(true);
      try {
          const res = await fetch(`https://www.sankavollerei.com/anime/samehadaku/server/${serverId}`);
          const data = await res.json();
          if (data.data?.url) {
              setCurrentServer(data.data.url);
          }
      } catch (error) {
          console.error("Error changing server:", error);
      } finally {
          setLoading(false);
      }
  };

  if (loading && !episode) {
    return <LoadingPage />;
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Episode not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="mb-6">
            <Link href="/stream" className="text-cyan-400 hover:underline text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Stream
            </Link>
        </div>

        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white line-clamp-1">{episode.title}</h1>
                
                {/* Enhanced Episode Navigation */}
                <div className="flex gap-3 w-full md:w-auto">
                    {episode.prev_episode ? (
                        <Link 
                            href={`/stream/watch/${episode.prev_episode.slug}`}
                            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-cyan-900/30 hover:border-cyan-500/50 text-white rounded-xl text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 group"
                        >
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Prev</span>
                        </Link>
                    ) : (
                        <button disabled className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 text-slate-600 rounded-xl text-sm border border-slate-800 cursor-not-allowed flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Prev</span>
                        </button>
                    )}
                    
                    {episode.next_episode ? (
                        <Link 
                            href={`/stream/watch/${episode.next_episode.slug}`}
                            className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-cyan-900/30 hover:border-cyan-500/50 text-white rounded-xl text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 group"
                        >
                            <span>Next</span>
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ) : (
                        <button disabled className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 text-slate-600 rounded-xl text-sm border border-slate-800 cursor-not-allowed flex items-center justify-center gap-2">
                            <span>Next</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-800 relative ring-1 ring-white/10">
                {loading ? (
                    <LoadingPage />
                ) : currentServer ? (
                    currentServer.includes('.mp4') ? (
                        <video 
                            src={currentServer} 
                            className="w-full h-full" 
                            controls
                            title={episode.title}
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <iframe 
                            src={currentServer} 
                            className="w-full h-full" 
                            allowFullScreen 
                            title={episode.title}
                        />
                    )
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 bg-slate-900">
                        <div className="text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            <p>Stream not available directly.</p>
                            <p className="text-sm mt-1">Please use the download links below.</p>
                        </div>
                    </div>
                )}
            </div>

            {episode.server && (
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                        <h3 className="text-base font-bold text-white">Server & Quality</h3>
                    </div>
                    <div className="space-y-4">
                        {episode.server.qualities.map((quality, qIdx) => (
                            <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[80px]">{quality.title}</span>
                                <div className="flex flex-wrap gap-2">
                                    {quality.serverList.map((server, sIdx) => (
                                        <button
                                            key={sIdx}
                                            onClick={() => handleServerChange(server.serverId)}
                                            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all border ${
                                                (currentServer === server.serverId) 
                                                ? "bg-cyan-600 text-white border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                                                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600"
                                            }`}
                                        >
                                            {server.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Options
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {episode.download_urls?.map((group, idx) => (
                        <div key={idx} className="bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-cyan-500/30 transition-colors group">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2 group-hover:border-slate-700 transition-colors">
                                <span className="font-bold text-cyan-400">{group.quality}</span>
                                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">Video</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {group.links.map((link, linkIdx) => (
                                    <a 
                                        key={linkIdx}
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-center py-2 px-3 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-cyan-500"
                                    >
                                        {link.provider}
                                    </a>
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
