// Storage utilities for Watch History and Favorites

export interface WatchHistoryItem {
  animeSlug: string;
  animeTitle: string;
  animePoster: string;
  episodeSlug: string;
  episodeTitle: string;
  watchedAt: number; // timestamp
  progress: number; // 0-100 percentage
  duration: number; // total duration in seconds
  currentTime: number; // current time in seconds
}

export interface FavoriteItem {
  animeSlug: string;
  animeTitle: string;
  animePoster: string;
  addedAt: number; // timestamp
}

const STORAGE_KEYS = {
  WATCH_HISTORY: "anime_watch_history",
  FAVORITES: "anime_favorites",
};

const MAX_HISTORY_ITEMS = 50;
const MAX_FAVORITES = 100;

// Watch History Functions
export const getWatchHistory = (): WatchHistoryItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading watch history:", error);
  }
  return [];
};

export const addToWatchHistory = (item: Omit<WatchHistoryItem, "watchedAt">): void => {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    // Remove existing entry for this episode
    const filtered = history.filter((h) => h.episodeSlug !== item.episodeSlug);
    // Add new entry at the beginning
    const newHistory: WatchHistoryItem[] = [
      {
        ...item,
        watchedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving watch history:", error);
  }
};

export const updateWatchProgress = (
  episodeSlug: string,
  progress: number,
  currentTime: number,
  duration: number
): void => {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    const index = history.findIndex((h) => h.episodeSlug === episodeSlug);
    if (index !== -1) {
      history[index].progress = progress;
      history[index].currentTime = currentTime;
      history[index].duration = duration;
      history[index].watchedAt = Date.now();
      localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(history));
    }
  } catch (error) {
    console.error("Error updating watch progress:", error);
  }
};

export const removeFromWatchHistory = (episodeSlug: string): void => {
  if (typeof window === "undefined") return;
  try {
    const history = getWatchHistory();
    const filtered = history.filter((h) => h.episodeSlug !== episodeSlug);
    localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing from watch history:", error);
  }
};

export const clearWatchHistory = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
};

export const getContinueWatching = (limit = 10): WatchHistoryItem[] => {
  const history = getWatchHistory();
  // Filter items with progress < 90% (not finished)
  return history.filter((h) => h.progress < 90).slice(0, limit);
};

// Favorites Functions
export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading favorites:", error);
  }
  return [];
};

export const addToFavorites = (item: Omit<FavoriteItem, "addedAt">): void => {
  if (typeof window === "undefined") return;
  try {
    const favorites = getFavorites();
    // Check if already exists
    if (favorites.some((f) => f.animeSlug === item.animeSlug)) {
      return; // Already in favorites
    }
    const newFavorites: FavoriteItem[] = [
      {
        ...item,
        addedAt: Date.now(),
      },
      ...favorites,
    ].slice(0, MAX_FAVORITES);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
  } catch (error) {
    console.error("Error saving favorite:", error);
  }
};

export const removeFromFavorites = (animeSlug: string): void => {
  if (typeof window === "undefined") return;
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((f) => f.animeSlug !== animeSlug);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
};

export const isFavorite = (animeSlug: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((f) => f.animeSlug === animeSlug);
};
