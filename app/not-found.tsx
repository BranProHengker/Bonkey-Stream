import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-dark text-slate-200 flex flex-col">
      <Navbar />
      <div className="grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background image with opacity */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/404.jpg"
            alt="404 Background"
            fill
            className="object-cover opacity-15"
            priority
            sizes="100vw"
          />
        </div>
        
        <div className="text-center max-w-md z-10 relative">
          <div className="bg-bg-card/70 backdrop-blur-md p-6 rounded-full mb-6 inline-flex items-center justify-center border border-white/10">
            <span className="text-5xl font-bold text-white">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Wakaranai</h1>
          <p className="text-periwinkle/60 mb-8 font-light">
            Oops! The episode you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/stream" 
              className="px-6 py-3 bg-white hover:bg-slate-200 text-bg-dark rounded-xl transition-colors font-semibold text-center text-sm"
            >
              Browse Anime
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 bg-bg-card hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-center border border-white/5 text-sm"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}