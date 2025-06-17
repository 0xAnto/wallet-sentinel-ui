import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GradientCardProps extends CardProps {
  variant?: "default" | "feature" | "glass"
}

export function GradientCard({ className, variant = "default", ...props }: GradientCardProps) {
  const variants = {
    default: "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50",
    feature: "bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 backdrop-blur-sm",
    glass: "bg-gradient-to-br from-gray-900/30 to-gray-800/30 border-gray-700/30 backdrop-blur-md",
  }

  return <Card className={cn(variants[variant], className)} {...props} />
}
