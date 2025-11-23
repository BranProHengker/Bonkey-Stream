export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeImages {
  jpg: {
    image_url: string;
    large_image_url: string;
  };
}

export interface AnimeAired {
  string: string;
  prop?: {
    from: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
    to: {
      day: number | null;
      month: number | null;
      year: number | null;
    };
  };
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: AnimeImages;
  synopsis: string;
  type: string;
  episodes: number | null;
  status: string;
  score: number | null;
  rating: string;
  genres: AnimeGenre[];
  aired: AnimeAired;
}