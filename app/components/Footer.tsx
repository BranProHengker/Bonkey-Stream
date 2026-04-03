import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-periwinkle border-t border-white/5">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                <img src="/favicon.png" alt="Bonkey Stream Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-white">Bonkey Stream</span>
            </div>
            <p className="text-sm text-periwinkle/60 leading-relaxed max-w-xs font-light">
              Your ultimate destination for discovering and exploring the world of anime. Join our community of anime
              enthusiasts.
            </p>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-bg-card rounded-md text-xs text-periwinkle/80 border border-white/5">Made with</span>
              <span className="text-red-500">💪🏼</span>
              <span className="text-xs text-periwinkle/60">Gusti Sigma</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/popular" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Popular Anime
                </Link>
              </li>
              <li>
                <Link href="/genre" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Browse Genres
                </Link>
              </li>
              <li>
                <Link href="/stream" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Stream Anime
                </Link>
              </li>
              <li>
                <Link href="/upcoming" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Upcoming
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/history" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Watch History
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Discussions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-periwinkle/60 hover:text-white transition-colors duration-200 font-light">
                  Watchlists
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Connect</h3>
            <div className="flex space-x-3">
              <a
                href="https://www.tiktok.com/@br4n._"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-bg-card rounded-lg hover:bg-white/10 transition-colors duration-200 border border-white/5"
              >
                <img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok.png" alt="TikTok" width="20" height="20" />
              </a>
              <a
                href="https://github.com/BranProHengker"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-bg-card rounded-lg hover:bg-white/10 transition-colors duration-200 border border-white/5"
              >
                <img src="https://img.icons8.com/ios-filled/50/ffffff/github.png" alt="GitHub" width="20" height="20" />
              </a>
              <a
                href="https://www.instagram.com/bran.nnz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-bg-card rounded-lg hover:bg-white/10 transition-colors duration-200 border border-white/5"
              >
                <img
                  src="https://img.icons8.com/ios-filled/50/ffffff/instagram.png"
                  alt="Instagram"
                  width="20"
                  height="20"
                />
              </a>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-periwinkle/40 uppercase tracking-wider font-semibold">Stay Updated</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm bg-bg-card border border-white/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo focus:border-indigo text-white placeholder-periwinkle/30 font-light"
                />
                <button className="px-4 py-2 text-sm bg-white hover:bg-slate-200 text-bg-dark rounded-lg transition-colors duration-200 font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-periwinkle/40">
              <span>&copy; 2025 Gusti Sigma. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <span className="text-white/10">•</span>
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
