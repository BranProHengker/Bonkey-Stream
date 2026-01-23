"use client"

import { getEpisode, EpisodeDetail } from "@/app/services/animeApi";
import { getAnimeDetail } from "@/app/services/animeApi";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadingPage from "@/app/components/LoadingPage";
import Link from "next/link";
import Image from "next/image";
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
            
            const slugParts = resolvedParams.slug.split("-");
            let extractedAnimeSlug = resolvedParams.slug;
            if (resolvedParams.slug.startsWith("kura-")) {
                extractedAnimeSlug = slugParts.slice(0, -1).join("-");
            } else {
                const lastPart = slugParts[slugParts.length - 1];
                if (!isNaN(Number(lastPart))) {
                    extractedAnimeSlug = slugParts.slice(0, -1).join("-");
                }
            }
            
            setAnimeSlug(extractedAnimeSlug);
            
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

  useEffect(() => {
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
      const history = getWatchHistory();
      const existing = history.find((h) => h.episodeSlug === slug);
      if (existing && existing.currentTime > 10) {
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
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background image with opacity */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/404.jpg"
              alt="404 Background"
              fill
              className="object-cover opacity-20"
              priority
              sizes="100vw"
            />
          </div>

          <div className="text-center max-w-md z-10 relative">
            <div className="bg-slate-900/70 backdrop-blur-sm p-6 rounded-full mb-6 inline-flex items-center justify-center border-2 border-dashed border-slate-700">
              <span className="text-5xl font-bold text-cyan-400">404</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Episode Not Found</h1>
            <p className="text-slate-400 mb-8">
              Oops! The episode you're looking for doesn't exist or may have been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/stream"
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors font-medium text-center"
              >
                Browse Anime
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-center border border-slate-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <Navbar />
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 max-w-7xl">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/stream" 
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Stream
          </Link>
        </div>

        <div className="space-y-6">
          {/* Title & Navigation */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl">
              {episode.title}
            </h1>
            
            {/* Episode Navigation */}
            <div className="flex gap-3 w-full lg:w-auto">
              {episode.prev_episode ? (
                <Link 
                  href={`/stream/watch/${episode.prev_episode.slug}`}
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-slate-800/60 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all border border-slate-700/50 hover:border-cyan-500/50 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </Link>
              ) : (
                <button 
                  disabled 
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-slate-900/50 text-slate-600 rounded-xl text-sm font-medium border border-slate-800/50 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </button>
              )}
              
              {episode.next_episode ? (
                <Link 
                  href={`/stream/watch/${episode.next_episode.slug}`}
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-xl text-sm font-semibold transition-all border border-cyan-500/50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105"
                >
                  <span>Next Episode</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button 
                  disabled 
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-slate-900/50 text-slate-600 rounded-xl text-sm font-medium border border-slate-800/50 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Next Episode</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Video Player */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative aspect-video w-full bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 ring-1 ring-white/5">
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
                <div className="flex items-center justify-center h-full text-slate-500 bg-slate-900/50 backdrop-blur-sm">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Stream not available</p>
                      <p className="text-sm text-slate-400">Please use the download links below</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Server Selection */}
          {episode.server && (
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">Server & Quality</h3>
              </div>
              <div className="space-y-5">
                {episode.server.qualities.map((quality, qIdx) => (
                  <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{quality.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quality.serverList.map((server, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleServerChange(server.serverId)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 border ${
                            (currentServer === server.serverId)
                            ? "bg-linear-to-r from-cyan-600 to-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30 scale-105"
                            : "bg-slate-800/60 text-slate-300 border-slate-700/50 hover:bg-cyan-600 hover:text-white hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 active:scale-95"
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

          {/* Download Section */}
          {episode.download_urls && episode.download_urls.length > 0 && (
            <div className="bg-linear-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
              {/* Header */}
              <div className="bg-slate-800/60 px-5 sm:px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4.5 h-4.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <span>Download Links</span>
                </h3>
              </div>

              {/* Download Options */}
              <div className="divide-y divide-slate-800/50">
                {episode.download_urls.map((group, idx) => {
                  const qualityStr = group.quality;
                  let format = '';
                  let resolution = '';
                  let subtitleType = '';
                  let size = '';

                  const formatMatch = qualityStr.match(/\b(MKV|MP4)\b/i);
                  if (formatMatch) format = formatMatch[1].toUpperCase();

                  const resMatch = qualityStr.match(/\b(\d+p)\b/i);
                  if (resMatch) resolution = resMatch[1];

                  const subMatch = qualityStr.match(/\((\w+sub)\)/i);
                  if (subMatch) subtitleType = subMatch[1];

                  const sizeMatch = qualityStr.match(/\(([^)]+)\)/g);
                  if (sizeMatch && sizeMatch.length > 0) {
                    const lastMatch = sizeMatch[sizeMatch.length - 1];
                    size = lastMatch.replace(/[()]/g, '');
                  }

                  const displayQuality = format && resolution 
                    ? `${format} ${resolution}${subtitleType ? ` (${subtitleType})` : ''}${size ? ` - ${size}` : ''}`
                    : qualityStr;

                  return (
                    <div key={idx} className="px-4 sm:px-6 py-4 hover:bg-slate-800/30 transition-colors group">
                      {/* Quality Header */}
                      <div className="mb-3 flex items-center gap-2">
                        <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white leading-tight">
                          {format && resolution ? (
                            <>
                              <span className="text-cyan-400">{format} {resolution}</span>
                              {subtitleType && (
                                <span className="text-slate-400"> ({subtitleType})</span>
                              )}
                              {size && (
                                <span className="text-slate-500 ml-1.5">• {size}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-cyan-400">{displayQuality}</span>
                          )}
                        </h4>
                      </div>

                      {/* Provider Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {group.links.map((link, linkIdx) => (
                          <a
                            key={linkIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 text-xs font-semibold bg-slate-800/80 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-700/50 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 active:scale-95 flex items-center gap-1.5"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
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