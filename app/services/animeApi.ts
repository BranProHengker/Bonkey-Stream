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

export const getHome = async () => {
  try {
    const res = await fetch(`${BASE_URL}/home`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch home");
    const json = await res.json();
    // Return recent anime list
    return {
        status: json.status,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: json.data?.recent?.animeList?.map((anime: any) => ({
            title: anime.title,
            slug: anime.animeId,
            poster: anime.poster,
            episodes: anime.episodes,
            releasedOn: anime.releasedOn
        })) || []
    };
  } catch (error) {
    console.error("Error fetching home:", error);
    return null;
  }
}

export const searchAnime = async (query: string, page = 1): Promise<{ status: string; data: AnimeResult[]; pagination?: Pagination } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error("Failed to search");
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
    console.error("Error searching anime:", error);
    return null;
  }
}

export const getAnimeDetail = async (slug: string): Promise<{ status: string; data: AnimeDetail } | null> => {
  try {
    const res = await fetch(`${BASE_URL}/anime/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch anime detail");
    const json = await res.json();
    const d = json.data;
    
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
    const res = await fetch(`${BASE_URL}/episode/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch episode");
    const json = await res.json();
    
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
