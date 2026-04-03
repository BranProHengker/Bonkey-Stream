"use client"
import { useState } from "react"
import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      console.log("Login attempt:", { username, password, rememberMe })
      router.push("/")
    } else {
      console.log("Sign up attempt:", { username, email, password })
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex bg-bg-dark">
      {/* Left Side: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10 bg-bg-dark">
        
        {/* Skip Button */}
        <button 
          onClick={() => router.push('/')}
          className="absolute top-6 right-6 text-periwinkle hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group z-50"
        >
          Skip Login
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-white/10 rounded-2xl mb-6 overflow-hidden shadow-lg">
              <Image
                src="/favicon.png"
                alt="Bonkey Stream Logo"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-periwinkle text-sm">
              {isLogin ? "Sign in to access your personalized anime experience" : "Join the ultimate anime community"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-bg-card rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 ${
                isLogin ? "bg-white text-bg-dark shadow" : "text-periwinkle hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 ${
                !isLogin ? "bg-white text-bg-dark shadow" : "text-periwinkle hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-periwinkle mb-1.5 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition-colors text-sm"
                placeholder="Enter your username"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-periwinkle mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition-colors text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-periwinkle mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-card border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition-colors text-sm pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-periwinkle hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-periwinkle hover:text-white transition-colors cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-bg-card checked:border-indigo checked:bg-indigo transition-all"
                    />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-periwinkle hover:text-white transition-colors font-medium">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white hover:bg-slate-200 text-bg-dark py-4 px-6 rounded-xl transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLogin ? "Login to Account" : "Create Free Account"}
            </button>

            {/* Social Login */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-bg-dark text-periwinkle/50">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center py-3 px-4 bg-bg-card hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                <span className="ml-2 text-periwinkle group-hover:text-white font-medium text-sm">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center py-3 px-4 bg-bg-card hover:bg-white/10 border border-white/5 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-periwinkle group-hover:text-white font-medium text-sm">GitHub</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Image/Banner Section */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        {/* Lighter overlays - waifu visible, text still readable via text-shadow */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-bg-dark/40 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent z-10" />
        
        {/* Background Image */}
        <div className="absolute inset-0 animate-slow-zoom">
          <Image
            src="/banner-login.png"
            alt="Anime Collage"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-80"
            priority
          />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-center p-12">
          <div className="max-w-lg space-y-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-black/30 border border-white/20 backdrop-blur-xl">
              <span className="text-white text-sm font-semibold tracking-wide uppercase">Ultimate Anime Database</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight [text-shadow:_0_4px_20px_rgba(0,0,0,0.8)]">
              Discover Your Next <br />
              <span className="text-indigo-300">Favorite Anime</span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-md mx-auto font-light [text-shadow:_0_2px_10px_rgba(0,0,0,0.6)]">
              Join thousands of anime enthusiasts. Explore your favorite anime, track your progress, and connect with the community.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 pt-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white [text-shadow:_0_2px_15px_rgba(0,0,0,0.7)]">10k+</p>
                <p className="text-sm text-white/70 font-semibold uppercase tracking-wider">Anime Titles</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white [text-shadow:_0_2px_15px_rgba(0,0,0,0.7)]">100%</p>
                <p className="text-sm text-white/70 font-semibold uppercase tracking-wider">Free Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
