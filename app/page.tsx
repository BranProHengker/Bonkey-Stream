'use client'
import Image from 'next/image';
import Link from 'next/link'; // Import Link dari Next.js
import Footer from '@/app/components/Footer';
import LoadingPage from '@/app/components/LoadingPage';

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-400 to-gray-200 text-gray-800">
      {/* Hero Section */}
      <div className="max-w-6xl w-full px-4 py-12 md:py-24 lg:py-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Column - Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 animate-typing">
              Welcome to Web <span className="text-blue-600">Dabes Anime</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              And this is my first Website using Next JS and skipping React.<br></br> I know me so Stupid but I want to use this.<br></br>
              And I want to be a Frontend Developer.
            </p>

            {/* Button to Home Page with Alert */}
            <Link
              href="/home"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-800 transition duration-300"
              onClick={() => {
                alert('IF YOU USE MOBILE DEVICE ROTATE YOUT PHONE FOR BEST EXPERIENCE');
              }}
            >
              Dabes Anime
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}