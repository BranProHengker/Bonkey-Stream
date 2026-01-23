# Bonkey Stream 📺

A modern, responsive, and ad-free Anime Streaming Platform built with **Next.js 16**. 
Bonkey Stream offers a premium streaming experience with a beautiful dark-themed UI, multi-source support, and batch downloads.

![Preview](public/banner-login.png)

## 🌟 Key Features

- **Ad-Free Streaming**: Enjoy anime without interruptions.
- **Multi-Source API**: 
  - **Samehadaku**: Primary source for ongoing and popular anime.
  - **Kuramanime**: Robust fallback source with multi-resolution support (360p, 480p, 720p, 1080p).
- **Jikan API (MyAnimeList)**: Used for detailed metadata, top charts, and genre categorization.
- **Batch Downloads**: Download full seasons in one go.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.
- **Modern UI/UX**: Built with Tailwind CSS, featuring glassmorphism, smooth animations, and a cinematic dark theme.
- **Spotlight Search**: Fast, full-screen search experience.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Heroicons & Custom SVG
- **State Management**: React Hooks
- **Data Fetching**: Server Actions & Client Components

## 🚀 API Sources

This project integrates multiple APIs to ensure high availability and comprehensive content:

1. **[Sankavollerei API](https://www.sankavollerei.com/)** (Unofficial)
   - Endpoints: `/samehadaku`, `/kuramanime`
   - Usage: Streaming links, episode lists, ongoing anime, and search.

2. **[Jikan API v4](https://jikan.moe/)**
   - Usage: Top anime charts, upcoming seasons, genre lists, and rich metadata.

## 📦 Installation & Setup

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/BranProHengker/Bonkey-Stream.git
cd Bonkey-Stream
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 📸 Screenshots (males mau ss project)

### Home Page
*Immersive hero section with trending anime.*

### Stream Page
*Clean grid layout for browsing ongoing and searched anime.*

### Watch Page
*Cinema-mode player with server switching and download options.*

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes only. All content is provided by third-party APIs.
Distributed under the MIT License.
