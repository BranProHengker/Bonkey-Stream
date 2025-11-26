"use client"

import { getEpisode, EpisodeDetail } from "@/app/services/animeApi";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
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
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{episode.title}</h1>
                <div className="flex gap-2">
                    {episode.prev_episode && (
                        <Link 
                            href={`/stream/watch/${episode.prev_episode.slug}`}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-700"
                        >
                            &larr; Prev
                        </Link>
                    )}
                    {episode.next_episode && (
                        <Link 
                            href={`/stream/watch/${episode.next_episode.slug}`}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors border border-slate-700"
                        >
                            Next &rarr;
                        </Link>
                    )}
                </div>
            </div>

            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-800 relative ring-1 ring-white/10">
                {loading ? (
                    <div className="flex items-center justify-center h-full bg-slate-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : currentServer ? (
                    <iframe 
                        src={currentServer} 
                        className="w-full h-full" 
                        allowFullScreen 
                        title={episode.title}
                    />
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
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">Select Server</h3>
                    <div className="space-y-3">
                        {episode.server.qualities.map((quality, qIdx) => (
                            <div key={qIdx} className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs text-slate-500 w-16">{quality.title}</span>
                                {quality.serverList.map((server, sIdx) => (
                                    <button
                                        key={sIdx}
                                        onClick={() => handleServerChange(server.serverId)}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white text-xs rounded-lg transition-colors border border-slate-700"
                                    >
                                        {server.title}
                                    </button>
                                ))}
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
                        <div key={idx} className="bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                                <span className="font-bold text-cyan-400">{group.quality}</span>
                                <span className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-400">Video</span>
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
