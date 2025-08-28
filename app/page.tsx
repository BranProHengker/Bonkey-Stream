"use client"
import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { username, password, rememberMe })
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Login Card */}
      <div className="w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden animate-fade-in">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl animate-pulse-glow"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-cyan-400/50 rounded-full mb-6 overflow-hidden animate-bounce-subtle">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-ShpnuY9WRbSxysdYDQcXTtWFIK73YZ.png"
                  alt="Anime Character"
                  className="w-20 h-20 object-cover rounded-full animate-float"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Welcome to Bonkey Stream
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="relative animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 outline-none transition-all backdrop-blur-sm hover:bg-slate-700/80 focus:scale-105"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 outline-none transition-all backdrop-blur-sm hover:bg-slate-700/80 focus:scale-105"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div
                className="flex items-center justify-between text-sm animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <label className="flex items-center text-slate-300 hover:text-white transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-cyan-400 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400/50 focus:ring-2 transition-all"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-slate-700/80 hover:bg-slate-600/80 text-white py-4 px-4 rounded-xl transition-all font-medium text-lg tracking-wider backdrop-blur-sm border border-slate-600/50 hover:border-cyan-400/50 hover:scale-105 active:scale-95 animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
