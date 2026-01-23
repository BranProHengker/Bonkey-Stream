import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Navbar />
      <div className="grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background image with opacity */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/404.jpg"
            alt="404 Background"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        </div>
        
        <div className="text-center max-w-md z-10 relative">
          <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-full mb-6 inline-flex items-center justify-center border-2  border-slate-700">
            <span className="text-5xl font-bold text-cyan-400">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Wakaranai</h1>
          <p className="text-slate-400 mb-8">
            Oops! The episode you're looking for doesn't exist or may have been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/stream" 
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors font-medium text-center"
            >
              Browse Anime
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium text-center border border-slate-700  backdrop-blur-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}