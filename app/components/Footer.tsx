export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto px-6 flex flex-col items-center text-center sm:flex-row sm:justify-between">
        <p className="text-sm sm:text-base">
          &copy; 2025 Gust Sigma. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-3 sm:mt-0">
          <a
            href="https://www.tiktok.com/@br4n._"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/tiktok.png" alt="TikTok" width="20" height="20" />
          </a>
          <a
            href="https://github.com/BranProHengker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/github.png" alt="GitHub" width="20" height="20" />
          </a>
          <a
            href="https://www.instagram.com/bran.nnz/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram.png" alt="Instagram" width="20" height="20" />
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        <a
          href="https://sociabuzz.com/br4nzet/tribe"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Support me on Sociabuzz
        </a>
      </div>
    </footer>
  );
}
