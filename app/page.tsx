"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 animate-in fade-in duration-1000">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40 animate-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-800 animate-in slide-in-from-bottom duration-700 delay-200">
              Connect with Your{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text">
                Next Career
              </span>{" "}
              Opportunity
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-700 delay-400">
              Join thousands of professionals finding their dream jobs, building meaningful connections, and advancing
              their careers with CareerConnect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-700 delay-600">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Start Your Journey
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 transform hover:scale-105"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <Card className="text-center bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-800">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 delay-1000">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
              <CardTitle className="text-slate-800">Find Your Perfect Job</CardTitle>
              <CardDescription className="text-slate-600">
                Discover opportunities that match your skills, experience, and career goals with our intelligent job
                matching system.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-1000">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 delay-1200">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-slate-800">Build Your Network</CardTitle>
              <CardDescription className="text-slate-600">
                Connect with industry professionals, mentors, and peers to expand your professional network and unlock
                new opportunities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-bottom duration-700 delay-1200">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500 delay-1400">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-slate-800">Advance Your Career</CardTitle>
              <CardDescription className="text-slate-600">
                Showcase your skills, track your applications, and get insights to accelerate your professional growth.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
