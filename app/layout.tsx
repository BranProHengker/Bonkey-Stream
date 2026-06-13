import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: {
    template: "%s | Bonkey Stream",
    default: "Bonkey Stream - Premium Anime Streaming",
  },
  description: "Nonton anime subtitle Indonesia dengan kualitas terbaik, tanpa iklan mengganggu, dan server super cepat hanya di Bonkey Stream.",
  keywords: ["anime", "streaming anime", "nonton anime subtitle indonesia", "bonkey stream", "anime online gratis"],
  authors: [{ name: "Bonkey Team" }],
  openGraph: {
    title: "Bonkey Stream - Premium Anime Streaming",
    description: "Nonton anime subtitle Indonesia dengan kualitas terbaik, tanpa iklan mengganggu, dan server super cepat hanya di Bonkey Stream.",
    url: "https://bonkey-stream.vercel.app", // Replace with your actual domain
    siteName: "Bonkey Stream",
    images: [
      {
        url: "/favicon.png", // Fallback image if specific page doesn't have one
        width: 800,
        height: 600,
        alt: "Bonkey Stream Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonkey Stream - Premium Anime Streaming",
    description: "Nonton anime subtitle Indonesia dengan kualitas terbaik, tanpa iklan mengganggu, dan server super cepat.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} dark`} suppressHydrationWarning>
      <body className="antialiased font-outfit min-h-screen bg-bg-dark text-white selection:bg-indigo selection:text-white">
        {children}
      </body>
    </html>
  )
}