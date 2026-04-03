"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import NavbarSearch from "@/app/components/NavbarSearch"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const pathname = usePathname()

  // Handle Scroll Effect
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Popular", path: "/popular" },
    { name: "Genres", path: "/genre" },
    { name: "Upcoming", path: "/upcoming" },
    { name: "Stream", path: "/stream" },
    { name: "History", path: "/history" },
  ]

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg-dark/80 backdrop-blur-md border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group outline-none">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-indigo transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <Image src="/favicon.png" alt="Bonkey Stream" width={36} height={36} className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-semibold tracking-wide text-white group-hover:text-periwinkle transition-colors duration-300">
                Bonkey
              </span>
            </Link>

            {/* Desktop Menu & Search */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Links */}
              <div className="flex items-center space-x-6 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative text-sm font-medium transition-colors duration-300 py-1 flex items-center justify-center outline-none ${
                      pathname === link.path 
                        ? "text-white" 
                        : "text-periwinkle hover:text-white"
                    }`}
                  >
                    {link.name}
                    {pathname === link.path && (
                      <span className="absolute -bottom-1 w-1.5 h-1.5 bg-indigo rounded-full shadow-[0_0_10px_rgba(80,87,122,0.8)]" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Search Bar (Desktop) */}
              <NavbarSearch />

              {/* Login Button (Desktop) */}
              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-5 py-2 bg-white text-bg-dark text-sm font-semibold rounded hover:bg-slate-200 transition-colors shadow-sm"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {/* Mobile Search Toggle */}
              <NavbarSearch />

              <button
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
                className="text-white hover:text-periwinkle focus:outline-none p-2 transition-colors"
                aria-label="Toggle Menu"
              >
                <div className="w-5 h-4 relative flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.75" : ""}`} />
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                  <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-bg-popover/95 backdrop-blur-xl rounded-2xl p-4 space-y-2 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 outline-none ${
                    pathname === link.path
                      ? "bg-indigo/20 text-white"
                      : "text-periwinkle hover:bg-slate/30 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="block px-4 py-3 mt-2 text-center bg-white text-bg-dark rounded-xl text-sm font-bold transition-all"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

