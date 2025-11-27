"use client"
import { useState } from "react"
import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AuthPage() {
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
      // Mock login success
      router.push("/home")
    } else {
      console.log("Sign up attempt:", { username, email, password })
      // Mock sign up success -> switch to login or auto-login
      router.push("/home")
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Side: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10 bg-slate-900">
        
        {/* Skip Button */}
        <button 
          onClick={() => router.push('/home')}
          className="absolute top-6 right-6 text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors flex items-center gap-2 group z-50"
        >
          Skip Login
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-cyan-400/30 rounded-2xl mb-6 overflow-hidden shadow-lg shadow-cyan-400/20">
              <Image
                src="/favicon.png"
                alt="Logo"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? "Welcome Back!" : "Join the Community"}
            </h1>
            <p className="text-slate-400 text-lg">
              {isLogin
                ? "Ready to continue your anime journey?"
                : "Start your adventure with Bonkey Stream today."}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 backdrop-blur-sm mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="space-y-4">
              {/* Username */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all hover:bg-slate-800/80 hover:border-slate-600"
                    required
                  />
                </div>
              </div>

              {/* Email (Sign Up Only) */}
              {!isLogin && (
                <div className="group animate-fade-in">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all hover:bg-slate-800/80 hover:border-slate-600"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all hover:bg-slate-800/80 hover:border-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-700 checked:border-cyan-500 checked:bg-cyan-500 transition-all"
                    />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="ml-2 group-hover:text-cyan-400 transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-slate-400 hover:text-cyan-400 transition-colors font-medium">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 px-6 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLogin ? "Login to Account" : "Create Free Account"}
            </button>

            {/* Social Login */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                <span className="ml-2 text-slate-300 group-hover:text-white font-medium">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-slate-300 group-hover:text-white font-medium">GitHub</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side: Image/Banner Section */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-cyan-900/20 mix-blend-overlay z-10" />
        
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
            <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <span className="text-cyan-300 text-sm font-semibold tracking-wide uppercase">Ultimate Anime Database</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
              Discover Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Favorite Anime</span>
            </h2>
            <p className="text-lg text-slate-200 leading-relaxed drop-shadow-md max-w-md mx-auto">
              Join thousands of anime enthusiasts. Explore your favorite anime, track your progress, and connect with the community.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 pt-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white drop-shadow-lg">10k+</p>
                <p className="text-sm text-cyan-200 font-medium uppercase tracking-wider">Anime Titles</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white drop-shadow-lg">100%</p>
                <p className="text-sm text-cyan-200 font-medium uppercase tracking-wider">Free Access</p>
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
