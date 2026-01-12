export const BASE_URL = "https://www.sankavollerei.com/anime/samehadaku";

export interface AnimeResult {
  title: string;
  slug: string;
  poster: string;
  status?: string;
  score?: string;
  type?: string;
  episodes?: string; // from home/recent
  releasedOn?: string; // from home/recent
  genreList?: { title: string; genreId: string; href: string }[];
  source?: 'samehadaku' | 'kuramanime';
}

export interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}

export interface BatchDetail {
  title: string;
  animeId: string;
  poster: string;
  japanese: string;
  type: string;
  score: string;
  duration: string;
  studios: string;
  producers: string;
  aired: string;
  credit: string;
  genreList: { title: string; genreId: string; href: string }[];
  downloadUrl: {
    formats: {
      title: string;
      qualities: {
        title: string;
        size: string;
        urls: { title: string; url: string }[];
      }[];
    }[];
  };
}

export interface AnimeDetail {
  title: string;
  slug: string;
  poster: string;
  synopsis: string;
  japanese_title?: string;
  english_title?: string;
  rating?: string;
  producers?: string;
  type?: string;
  status?: string;
  episode_count?: number | string;
  duration?: string;
  aired?: string;
  studios?: string;
  genres?: { title: string; genreId: string; href: string }[];
  batch?: { title: string; batchId: string; href: string } | null;
  episode_lists: {
    title: string | number;
    slug: string;
    href: string;
  }[];
}

export interface EpisodeDetail {
  title: string;
  stream_url: string;
  prev_episode?: { slug: string; href: string } | null;
  next_episode?: { slug: string; href: string } | null;
  server?: {
    qualities: {
      title: string;
      serverList: {
        title: string;
        serverId: string;
        href: string;
      }[];
    }[];
  };
  download_urls: {
    quality: string;
    links: { provider: string; url: string }[];
  }[];
}

export const getHome = async (): Promise<{ status: string; data: AnimeResult[] } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/home`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch home");
    const json = await res.json();
    // Return recent anime list with full AnimeResult format
    return {
        status: json.status,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: json.data?.recent?.animeList?.map((anime: any) => ({
            title: anime.title,
            slug: anime.animeId,
            poster: anime.poster,
            episodes: anime.episodes,
            releasedOn: anime.releasedOn,
            status: anime.status,
            score: anime.score,
            type: anime.type,
            genreList: anime.genreList,
            source: 'samehadaku' as const
        })) || []
    };
  } catch (error) {
    console.error("Error fetching home:", error);
    return null;
  }
}

export const searchAnime = async (query: string, page = 1): Promise<{ status: string; data: AnimeResult[]; pagination?: Pagination } | null> => {
  try {
    // Try Samehadaku first
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`);
    if (res.ok) {
        const json = await res.json();
        if (json.data?.animeList && json.data.animeList.length > 0) {
            return {
                status: json.status,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data: json.data.animeList.map((anime: any) => ({
                    title: anime.title,
                    slug: anime.animeId,
                    poster: anime.poster,
                    status: anime.status,
                    score: anime.score,
                    type: anime.type,
                    genreList: anime.genreList,
                    source: 'samehadaku'
                })),
                pagination: json.pagination
            };
        }
    }

    // Fallback to Kuramanime if Samehadaku fails or returns empty
    // Note: Kuramanime might not support pagination in the same way, or we just fetch page 1 for fallback
    if (page === 1) {
        const kuraRes = await fetch(`https://www.sankavollerei.com/anime/kura/search/${encodeURIComponent(query)}`);
        if (kuraRes.ok) {
            const kuraJson = await kuraRes.json();
            if (kuraJson.results && kuraJson.results.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return {
                    status: kuraJson.status,
                    data: kuraJson.results.map((anime: any) => ({
                        title: anime.title,
                        // Prefix slug with 'kura-' and include ID to identify source and fetch details later
                        slug: `kura-${anime.id}-${anime.slug}`, 
                        poster: anime.image,
                        status: anime.status,
                        score: anime.rating,
                        type: anime.type,
                        source: 'kuramanime'
                    })),
                    pagination: {
                        currentPage: 1,
                        hasPrevPage: false,
                        prevPage: null,
                        hasNextPage: false,
                        nextPage: null,
                        totalPages: 1
                    }
                };
            }
        }
    }

    return { status: "error", data: [], pagination: undefined };
  } catch (error) {
    console.error("Error searching anime:", error);
    return null;
  }
}

export const getAnimeDetail = async (slug: string): Promise<{ status: string; data: AnimeDetail } | null> => {
  try {
    let url = `${BASE_URL}/anime/${slug}`;
    let isKuramanime = false;

    // Check if it's a Kuramanime slug
    if (slug.startsWith('kura-')) {
        isKuramanime = true;
        // Extract ID and real slug: kura-123-naruto -> id: 123, slug: naruto
        const match = slug.match(/^kura-(\d+)-(.+)$/);
        if (match) {
            const id = match[1];
            const realSlug = match[2];
            url = `https://www.sankavollerei.com/anime/kura/anime/${id}/${realSlug}`;
        } else {
             throw new Error("Invalid Kuramanime slug format");
        }
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch anime detail");
    const json = await res.json();
    const d = json.data;

    if (isKuramanime) {
        const d = json.results; // Kuramanime uses 'results'
        
        return {
            status: json.status,
            data: {
                title: d.title,
                slug: slug,
                poster: d.image,
                synopsis: d.description,
                japanese_title: d.title_raw,
                rating: d.details?.find((x: any) => x.type === "Skor:")?.data,
                type: d.details?.find((x: any) => x.type === "Tipe:")?.data,
                status: d.details?.find((x: any) => x.type === "Status:")?.data,
                episode_count: d.details?.find((x: any) => x.type === "Episode:")?.data,
                duration: d.details?.find((x: any) => x.type === "Durasi:")?.data,
                aired: d.details?.find((x: any) => x.type === "Tayang:")?.data,
                studios: d.details?.find((x: any) => x.type === "Studio:")?.data,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                genres: d.details?.find((x: any) => x.type === "Genre:")?.data?.split(',').map((g: string) => ({ title: g.trim(), genreId: g.trim().toLowerCase(), href: '' })) || [],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                episode_lists: d.episode?.map((ep: number) => ({
                    title: `Episode ${ep}`,
                    slug: `kura-${slug.split('-')[1]}-${slug.split('-').slice(2).join('-')}-${ep}`,
                    href: '' 
                })) || []
            }
        };
    }
    
    // ... existing Samehadaku mapping ...
    // Handle empty title
    const title = d.title || d.english || d.japanese || d.synonyms || "Unknown Title";

    return {
        status: json.status,
        data: {
            title: title,
            slug: slug, // animeId not usually in detail response, reusing slug
            poster: d.poster,
            synopsis: d.synopsis?.paragraphs?.join("\n\n") || "",
            japanese_title: d.japanese,
            english_title: d.english,
            rating: d.score?.value,
            producers: d.producers,
            type: d.type,
            status: d.status,
            episode_count: d.episodes,
            duration: d.duration,
            aired: d.aired,
            studios: d.studios,
            genres: d.genreList,
            batch: d.batchList?.[0] ? { 
                title: d.batchList[0].title, 
                batchId: d.batchList[0].batchId, 
                href: d.batchList[0].href 
            } : null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            episode_lists: d.episodeList?.map((ep: any) => ({
                title: ep.title,
                slug: ep.episodeId,
                href: ep.href
            })) || []
        }
    };
  } catch (error) {
    console.error("Error fetching anime detail:", error);
    return null;
  }
}

export const getBatch = async (slug: string): Promise<{ status: string; data: BatchDetail } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/batch/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch batch");
    return await res.json();
  } catch (error) {
    console.error("Error fetching batch:", error);
    return null;
  }
}


export const getEpisode = async (slug: string): Promise<{ status: string; data: EpisodeDetail } | null> => {
  try {
    let url = `${BASE_URL}/episode/${slug}`;
    let isKuramanime = false;

    if (slug.startsWith('kura-')) {
        isKuramanime = true;
        // Format from getAnimeDetail: kura-<id>-<slug>-<episode>
        // e.g., kura-185-naruto-1
        // BUT, the endpoint is /anime/kura/watch/:id/:slug/:episode
        // I need to parse 185, naruto, 1 from kura-185-naruto-1
        // This is ambiguous if slug has dashes.
        // Let's assume the slug part is the middle part.
        // Actually, earlier I used `kura-${anime.id}-${anime.slug}` for the anime detail page.
        // For episode list in detail page, I constructed:
        // `kura-${slug.split('-')[1]}-${slug.split('-').slice(2).join('-')}-${ep.episode}`
        // which effectively appends `-<episode>` to the anime slug.
        // So: `kura-185-naruto-1` -> id=185, slug=naruto, episode=1.
        // Parsing:
        // split by '-'
        // [0] = kura
        // [1] = id
        // [last] = episode
        // [2..last-1] = slug
        
        const parts = slug.split('-');
        if (parts.length >= 4) {
            const id = parts[1];
            const episode = parts[parts.length - 1];
            const realSlug = parts.slice(2, parts.length - 1).join('-');
            url = `https://www.sankavollerei.com/anime/kura/watch/${id}/${realSlug}/${episode}`;
        } else {
             // Fallback or error
             console.error("Invalid Kuramanime episode slug:", slug);
             return null;
        }
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch episode");
    const json = await res.json();
    
    if (isKuramanime) {
        const d = json.data; // Watch endpoint uses 'data' for Kuramanime in my fetch sample
        // Correction: My fetch sample for WATCH endpoint was not used yet. Wait.
        // Fetch for WATCH endpoint: https://www.sankavollerei.com/anime/kura/watch/185/naruto/1
        // Response: { status: "success", ..., title: "[BD] Naruto...", streams: [...], downloads: [...] }
        // It seems 'data' is NOT wrapped in 'data' property for Kuramanime WATCH endpoint?
        // Wait, look at the fetch result again.
        /*
        {
          "status": "success",
          "creator": "Sanka Vollerei",
          "source": "Kuramanime",
          "title": "[BD] Naruto (Episode 01) Subtitle Indonesia",
          "streams": [...],
          "downloads": [...]
        }
        */
        // It is NOT wrapped in `data`. It's at the root level?
        // But `getEpisode` does `const json = await res.json();`.
        // Then checks `if (isKuramanime)`.
        // I need to handle this structure.
        
        // Let's assume `d` is `json`.
        const kuraData = json;

        const download_urls: EpisodeDetail['download_urls'] = [];
        if (kuraData.downloads) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             kuraData.downloads.forEach((group: any) => {
                 download_urls.push({
                     quality: group.quality_group,
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     links: group.links.map((l: any) => ({ provider: l.provider, url: l.url || '' })).filter((l: any) => l.url)
                 });
             });
        }

        // Get stream URL (prefer 720p or first)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bestStream = kuraData.streams?.find((s: any) => s.quality === "720") || kuraData.streams?.[0];

        // Map Kuramanime streams to server structure for UI selection
        const server = kuraData.streams && kuraData.streams.length > 0 ? {
            qualities: [{
                title: "Resolution",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                serverList: kuraData.streams.map((s: any) => ({
                    title: `${s.quality}p`,
                    serverId: s.url, // Use URL as ID for direct switching
                    href: ""
                }))
            }]
        } : undefined;

        return {
            status: json.status,
            data: {
                title: kuraData.title || `Episode`,
                stream_url: bestStream?.url || '',
                // prev/next: `navigation.prev`, `navigation.next` are episode numbers (string/int) or null.
                // Need to reconstruct slugs: kura-<id>-<slug>-<ep>
                prev_episode: kuraData.navigation?.prev ? { 
                    slug: `kura-${slug.split('-')[1]}-${slug.split('-').slice(2, -1).join('-')}-${kuraData.navigation.prev}`,
                    href: '' 
                } : null,
                next_episode: kuraData.navigation?.next ? { 
                    slug: `kura-${slug.split('-')[1]}-${slug.split('-').slice(2, -1).join('-')}-${kuraData.navigation.next}`,
                    href: '' 
                } : null,
                server, // Add server/resolution selection
                download_urls
            }
        };
    }

    if (json.data) {
        const d = json.data;
        const download_urls: EpisodeDetail['download_urls'] = [];
        
        if (d.downloadUrl?.formats) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             d.downloadUrl.formats.forEach((format: any) => {
                 if (format.qualities) {
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                     format.qualities.forEach((q: any) => {
                         download_urls.push({
                             quality: `${format.title} - ${q.title}`,
                             // eslint-disable-next-line @typescript-eslint/no-explicit-any
                             links: q.urls.map((u: any) => ({ provider: u.title, url: u.url }))
                         });
                     });
                 }
             });
        }

        return {
            status: json.status,
            data: {
                title: d.title,
                stream_url: d.defaultStreamingUrl,
                prev_episode: d.hasPrevEpisode ? { slug: d.prevEpisode.episodeId, href: d.prevEpisode.href } : null,
                next_episode: d.hasNextEpisode ? { slug: d.nextEpisode.episodeId, href: d.nextEpisode.href } : null,
                server: d.server,
                download_urls
            }
        };
    }
    return null;
  } catch (error) {
    console.error("Error fetching episode:", error);
    return null;
  }
}

// Ongoing anime
export const getOngoing = async (page = 1): Promise<{ status: string; data: AnimeResult[]; pagination?: Pagination } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/ongoing?page=${page}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch ongoing");
    const json = await res.json();
    
    return {
        status: json.status,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: json.data?.animeList?.map((anime: any) => ({
            title: anime.title,
            slug: anime.animeId,
            poster: anime.poster,
            status: anime.status,
            score: anime.score,
            type: anime.type,
            genreList: anime.genreList
        })) || [],
        pagination: json.pagination
    };
  } catch (error) {
    console.error("Error fetching ongoing:", error);
    return null;
  }
}
