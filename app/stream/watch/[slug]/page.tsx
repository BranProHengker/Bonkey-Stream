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
                    if (extractedAnimeSlug.endsWith("-episode")) {
                        extractedAnimeSlug = extractedAnimeSlug.replace(/-episode$/, "");
                    }
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
    if (slug && episode && animeSlug) {
      // Use fallback title if animeTitle is not loaded yet.
      const fallbackTitle = animeSlug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      addToWatchHistory({
        animeSlug,
        animeTitle: animeTitle || fallbackTitle,
        animePoster: animePoster || "",
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
      <div className="min-h-screen bg-bg-dark text-white flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/404.jpg"
              alt="404 Background"
              fill
              className="object-cover opacity-15"
              priority
              sizes="100vw"
            />
          </div>

          <div className="text-center max-w-md z-10 relative">
            <div className="bg-bg-card/70 backdrop-blur-md p-6 rounded-full mb-6 inline-flex items-center justify-center border border-white/10">
              <span className="text-5xl font-bold text-white">404</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Episode Not Found</h1>
            <p className="text-periwinkle/60 mb-8 font-light">
              Oops! The episode you're looking for doesn't exist or may have been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/stream"
                className="px-6 py-3 bg-white hover:bg-slate-200 text-bg-dark rounded-xl transition-colors font-semibold text-center text-sm"
              >
                Browse Anime
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-bg-card hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-center border border-white/5 text-sm"
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
    <div className="min-h-screen bg-bg-dark text-white">
      <Navbar />
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 max-w-7xl">
        {/* Back button */}
        <div className="mb-6">
          <Link 
             href={`/stream/${animeSlug}`}
            className="inline-flex items-center gap-2 text-sm text-periwinkle hover:text-white transition-colors group font-medium"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Details
          </Link>
        </div>

        <div className="space-y-6">
          {/* Title & Navigation */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl tracking-tight">
              {episode.title}
            </h1>
            
            {/* Episode Navigation */}
            <div className="flex gap-3 w-full lg:w-auto">
              {episode.prev_episode ? (
                <Link 
                  href={`/stream/watch/${episode.prev_episode.slug}`}
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-bg-card hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all border border-white/5 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-4 h-4 text-periwinkle group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </Link>
              ) : (
                <button 
                  disabled 
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-bg-card/50 text-periwinkle/30 rounded-xl text-sm font-medium border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
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
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-white hover:bg-slate-200 text-bg-dark rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <span>Next Episode</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button 
                  disabled 
                  className="flex-1 lg:flex-none px-5 py-2.5 bg-bg-card/50 text-periwinkle/30 rounded-xl text-sm font-medium border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-indigo/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative aspect-video w-full bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10">
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
                <div className="flex items-center justify-center h-full text-periwinkle bg-bg-dark/50 backdrop-blur-sm">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-bg-card rounded-full flex items-center justify-center border border-white/5">
                      <svg className="w-8 h-8 text-periwinkle/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">Stream not available</p>
                      <p className="text-sm font-light text-periwinkle/80">Please use the download links below</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Server Selection */}
          {episode.server && (
            <div className="bg-bg-card backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/5 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Server & Quality</h3>
              </div>
              <div className="space-y-4">
                {episode.server.qualities.map((quality, qIdx) => (
                  <div key={qIdx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-bg-dark/30 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="w-1.5 h-1.5 bg-indigo rounded-full"></span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{quality.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quality.serverList.map((server, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleServerChange(server.serverId)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 border ${
                            (currentServer === server.serverId)
                            ? "bg-white text-bg-dark border-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
                            : "bg-white/5 text-periwinkle border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 active:scale-95"
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
            <div className="bg-bg-card backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-xl">
              {/* Header */}
              <div className="bg-white/5 px-5 sm:px-6 py-5 border-b border-white/5">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-3 tracking-tight">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <span>Download Links</span>
                </h3>
              </div>

              {/* Download Options */}
              <div className="divide-y divide-white/5">
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
                    <div key={idx} className="px-5 sm:px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                      {/* Quality Header */}
                      <div className="mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-periwinkle rounded-full"></span>
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight tracking-wide">
                          {format && resolution ? (
                            <>
                              <span className="text-white">{format} {resolution}</span>
                              {subtitleType && (
                                <span className="text-periwinkle/70 font-medium"> ({subtitleType})</span>
                              )}
                              {size && (
                                <span className="text-periwinkle/50 font-normal ml-2">• {size}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-white">{displayQuality}</span>
                          )}
                        </h4>
                      </div>

                      {/* Provider Buttons */}
                      <div className="flex flex-wrap gap-2.5">
                        {group.links.map((link, linkIdx) => (
                          <a
                            key={linkIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-xs font-semibold bg-bg-dark/50 hover:bg-white hover:text-bg-dark text-periwinkle rounded-lg transition-all duration-300 border border-white/5 hover:border-transparent hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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