import type { Metadata } from "next";
import { getEpisode, getAnimeDetail } from "@/app/services/animeApi";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const episodeData = await getEpisode(slug);
  const episode = episodeData?.data;

  if (!episode) {
    return {
      title: "Episode Not Found",
    };
  }

  // Extract anime slug from episode slug to fetch the poster
  const slugParts = slug.split("-");
  let extractedAnimeSlug = slug;
  if (slug.startsWith("kura-")) {
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

  let poster = "/favicon.png";
  let synopsis = `Nonton ${episode.title} subtitle Indonesia gratis di Bonkey Stream.`;
  
  try {
    const animeData = await getAnimeDetail(extractedAnimeSlug);
    if (animeData?.data) {
      if (animeData.data.poster) poster = animeData.data.poster;
      if (animeData.data.synopsis) synopsis = animeData.data.synopsis;
    }
  } catch (e) {
    // ignore
  }

  return {
    title: `Watch ${episode.title}`,
    description: synopsis,
    openGraph: {
      title: `Watch ${episode.title} - Bonkey Stream`,
      description: synopsis,
      images: [{ url: poster }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Watch ${episode.title} - Bonkey Stream`,
      description: synopsis,
      images: [poster],
    },
  };
}

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
