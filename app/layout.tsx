import type { Metadata } from "next";
import { Montserrat} from "next/font/google";
import "./globals.css";



const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Dabes Anime",
  description: "Si Paling Wibu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>{children}</body>
    
    </html>
  )
}