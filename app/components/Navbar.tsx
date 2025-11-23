"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Popular", path: "/popular" },
    { name: "Genres", path: "/genre" },
    { name: "Upcoming", path: "/upcoming" },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-md border-b border-white/5 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-cyan-400/30 group-hover:ring-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <img src="/favicon.png" alt="Bonkey Stream" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-300">
              Bonkey Stream
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                  pathname === link.path ? "text-cyan-400" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full transform origin-left transition-transform duration-300 ${
                    pathname === link.path ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-2"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 space-y-2 border border-white/10 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.path
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
