"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import NavbarSearch from "@/app/components/NavbarSearch"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  
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

  // Handle Theme (Manual Class Strategy)
  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || systemTheme

    setTheme(initialTheme)
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const navLinks = [
    { name: "Home", path: "/home" },
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
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/10 dark:border-white/5 py-3 shadow-lg shadow-black/5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/home" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-cyan-400/30 group-hover:ring-cyan-400 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <Image src="/favicon.png" alt="Bonkey Stream" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-300">
                Bonkey Stream
              </span>
            </Link>

            {/* Desktop Menu & Search & Theme */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Links */}
              <div className="flex items-center space-x-6 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                      pathname === link.path 
                        ? "text-cyan-500 dark:text-cyan-400" 
                        : "text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white"
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

              {/* Search Bar (Desktop) */}
              <NavbarSearch />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-yellow-400"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {/* Mobile Search Toggle */}
              <NavbarSearch />

              <button
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
                className="text-slate-600 dark:text-slate-300 focus:outline-none p-2"
                aria-label="Toggle Menu"
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
              isOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 space-y-2 border border-slate-200 dark:border-white/10 shadow-xl">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === link.path
                      ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-200"
              >
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                {theme === "dark" ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

