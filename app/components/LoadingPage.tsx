// components/LoadingPage.tsx

'use client'; // Jika menggunakan state atau hooks

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 z-50">
      {/* Typing Animation */}
      <p className="text-xl sm:text-2xl font-bold text-gray-300 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-gray-300 pr-2">
        Please Wait A Second.....
      </p>

      {/* Pulsating Dots */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
      </div>
    </div>
  );
}