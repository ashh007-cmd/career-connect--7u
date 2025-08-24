import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("rounded-lg bg-primary flex items-center justify-center", sizeClasses[size])}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("text-primary-foreground", size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-6 w-6")}
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M9 14h6" />
          <path d="M9 18h6" />
        </svg>
      </div>
      <span className={cn("font-serif font-semibold text-foreground", textSizeClasses[size])}>CareerConnect</span>
    </div>
  )
}
