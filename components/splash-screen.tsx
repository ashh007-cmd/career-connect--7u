"use client"

import { useEffect, useState } from "react"
import { Logo } from "./logo"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 300) // Wait for fade out animation
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center space-y-4">
          <Logo size="lg" className="justify-center" />
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-primary rounded-full animate-pulse" />
            <div className="h-1 w-8 bg-primary/60 rounded-full animate-pulse delay-150" />
            <div className="h-1 w-8 bg-primary/30 rounded-full animate-pulse delay-300" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center space-y-6">
        <div className="animate-fade-in">
          <Logo size="lg" className="justify-center" />
        </div>
        <div className="space-y-2 animate-fade-in delay-500">
          <p className="text-lg font-medium text-muted-foreground">Welcome to CareerConnect</p>
          <p className="text-sm text-muted-foreground">Connecting talent with opportunity</p>
        </div>
        <div className="flex items-center justify-center gap-2 animate-fade-in delay-1000">
          <div className="h-1 w-8 bg-primary rounded-full animate-pulse" />
          <div className="h-1 w-8 bg-primary/60 rounded-full animate-pulse delay-150" />
          <div className="h-1 w-8 bg-primary/30 rounded-full animate-pulse delay-300" />
        </div>
      </div>
    </div>
  )
}
