import type React from "react"
import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  variant?: "blue-purple" | "green-emerald" | "purple-pink" | "blue-cyan" | "yellow-orange"
}

export function GradientText({ children, className, variant = "blue-purple" }: GradientTextProps) {
  const variants = {
    "blue-purple": "bg-gradient-to-r from-blue-400 to-purple-400",
    "green-emerald": "bg-gradient-to-r from-green-400 to-emerald-400",
    "purple-pink": "bg-gradient-to-r from-purple-400 to-pink-400",
    "blue-cyan": "bg-gradient-to-r from-blue-400 to-cyan-400",
    "yellow-orange": "bg-gradient-to-r from-yellow-400 to-orange-400",
  }

  return <span className={cn(variants[variant], "bg-clip-text text-transparent", className)}>{children}</span>
}
