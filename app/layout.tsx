import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: "Bonkey Stream",
  description: "Si Paling Wibu",
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