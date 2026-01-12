import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
                <img src="/favicon.png" alt="Bonkey Stream Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-white">Bonkey Stream</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your ultimate destination for discovering and exploring the world of anime. Join our community of anime
              enthusiasts.
            </p>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300">Made with</span>
              <span className="text-red-500">💪🏼</span>
              <span className="text-xs text-gray-400">Gusti Sigma</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/popular" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Popular Anime
                </Link>
              </li>
              <li>
                <Link href="/genre" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Browse Genres
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Discussions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Watchlists
                </Link>
              </li>
              <li>
                <a
                  href="https://sociabuzz.com/br4nzet/tribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Support Us
                </a>
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
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok.png" alt="TikTok" width="20" height="20" />
              </a>
              <a
                href="https://github.com/BranProHengker"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <img src="https://img.icons8.com/ios-filled/50/ffffff/github.png" alt="GitHub" width="20" height="20" />
              </a>
              <a
                href="https://www.instagram.com/bran.nnz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200"
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
              <p className="text-xs text-gray-400 uppercase tracking-wider">Stay Updated</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <span>&copy; 2025 Gust Sigma. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <Link href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <span className="text-gray-600">•</span>
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
