"use client"

import { getEpisode, EpisodeDetail } from "@/app/services/animeApi";
import { getAnimeDetail } from "@/app/services/animeApi";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingPage from "@/app/components/LoadingPage";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { addToWatchHistory, updateWatchProgress, getWatchHistory } from "@/app/utils/storage";

export default function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [currentServer, setCurrentServer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [animeTitle, setAnimeTitle] = useState<string>("");
  const [animePoster, setAnimePoster] = useState<string>("");
  const [animeSlug, setAnimeSlug] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    params.then(async (resolvedParams) => {
        setSlug(resolvedParams.slug);
        const episodeData = await getEpisode(resolvedParams.slug);
        if (episodeData?.data) {
            setEpisode(episodeData.data);
            setCurrentServer(episodeData.data.stream_url);
            
            // Extract anime slug from episode slug
            // Format: animeSlug-episodeNumber or kura-id-slug-episode
            const slugParts = resolvedParams.slug.split("-");
            let extractedAnimeSlug = resolvedParams.slug;
            if (resolvedParams.slug.startsWith("kura-")) {
                // For kuramanime: kura-id-slug-episode -> kura-id-slug
                extractedAnimeSlug = slugParts.slice(0, -1).join("-");
            } else {
                // For samehadaku: animeSlug-episodeNumber -> animeSlug
                const lastPart = slugParts[slugParts.length - 1];
                if (!isNaN(Number(lastPart))) {
                    extractedAnimeSlug = slugParts.slice(0, -1).join("-");
                }
            }
            
            setAnimeSlug(extractedAnimeSlug);
            
            // Fetch anime detail for title and poster
            try {
                const animeData = await getAnimeDetail(extractedAnimeSlug);
                if (animeData?.data) {
                    setAnimeTitle(animeData.data.title);
                    setAnimePoster(animeData.data.poster);
                }
            } catch (error) {
                console.error("Error fetching anime detail:", error);
            }
        }
        setLoading(false);
    });
  }, [params]);

  // Track video progress and save to history
  useEffect(() => {
    // Save to history immediately when page loads (for both video and iframe)
    if (animeTitle && animePoster && animeSlug && episode) {
      addToWatchHistory({
        animeSlug,
        animeTitle,
        animePoster,
        episodeSlug: slug,
        episodeTitle: episode.title || "Episode",
        progress: 0,
        duration: 0,
        currentTime: 0,
      });
    }
  }, [slug, animeTitle, animePoster, animeSlug, episode]);

  // Track video progress for MP4 videos only
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !animeTitle || !animeSlug) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        updateWatchProgress(
          slug,
          progress,
          video.currentTime,
          video.duration
        );
      }
    };

    const handleLoadedMetadata = () => {
      // Check if there's existing progress
      const history = getWatchHistory();
      const existing = history.find((h) => h.episodeSlug === slug);
      if (existing && existing.currentTime > 10) {
        // Resume from saved position if more than 10 seconds
        video.currentTime = existing.currentTime;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [slug, animeTitle, animeSlug]);

  // Share functionality
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

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

            <div className="aspect-video w-full bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-slate-800 relative ring-1 ring-white/10">
                {loading ? (
                    <LoadingPage />
                ) : currentServer ? (
                    currentServer.includes('.mp4') ? (
                        <video 
                            ref={videoRef}
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

            {/* Download Section - Organized Design */}
            {episode.download_urls && episode.download_urls.length > 0 && (
                <div className="mt-6 bg-slate-900/80 rounded-lg border border-slate-800 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-800/50 px-3 py-2 border-b border-slate-700">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>TAUTAN UNDUH</span>
                            <span className="text-red-400">NF</span>
                        </h3>
                    </div>

                    {/* Download Options */}
                    <div className="divide-y divide-slate-800">
                        {episode.download_urls.map((group, idx) => {
                            // Parse quality string - handle formats like:
                            // "MKV 480p (Softsub) - (504.40 MB)"
                            // "MP4 720p (Hardsub) - (1.18 GB)"
                            // Or simple format like "Format - Quality"
                            const qualityStr = group.quality;
                            let format = '';
                            let resolution = '';
                            let subtitleType = '';
                            let size = '';

                            // Try to extract format (MKV/MP4)
                            const formatMatch = qualityStr.match(/\b(MKV|MP4)\b/i);
                            if (formatMatch) format = formatMatch[1].toUpperCase();

                            // Try to extract resolution (480p, 720p, 1080p, etc)
                            const resMatch = qualityStr.match(/\b(\d+p)\b/i);
                            if (resMatch) resolution = resMatch[1];

                            // Try to extract subtitle type (Softsub/Hardsub)
                            const subMatch = qualityStr.match(/\((\w+sub)\)/i);
                            if (subMatch) subtitleType = subMatch[1];

                            // Try to extract size
                            const sizeMatch = qualityStr.match(/\(([^)]+)\)/g);
                            if (sizeMatch && sizeMatch.length > 0) {
                                // Get the last match which is usually the size
                                const lastMatch = sizeMatch[sizeMatch.length - 1];
                                size = lastMatch.replace(/[()]/g, '');
                            }

                            // Fallback: if parsing fails, use original string
                            const displayQuality = format && resolution 
                                ? `${format} ${resolution}${subtitleType ? ` (${subtitleType})` : ''}${size ? ` - (${size})` : ''}`
                                : qualityStr;

                            return (
                                <div key={idx} className="px-3 py-2.5 hover:bg-slate-800/30 transition-colors">
                                    {/* Quality Header */}
                                    <div className="mb-2">
                                        <h4 className="text-xs font-semibold text-white leading-tight">
                                            {format && resolution ? (
                                                <>
                                                    <span className="text-cyan-400">{format} {resolution}</span>
                                                    {subtitleType && (
                                                        <span className="text-slate-400"> ({subtitleType})</span>
                                                    )}
                                                    {size && (
                                                        <span className="text-slate-500 ml-1.5">- ({size})</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-cyan-400">{displayQuality}</span>
                                            )}
                                        </h4>
                                    </div>

                                    {/* Provider Buttons */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {group.links.map((link, linkIdx) => (
                                            <a
                                                key={linkIdx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded transition-all border border-slate-700 hover:border-cyan-500 active:scale-95"
                                            >
                                                {link.provider}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
