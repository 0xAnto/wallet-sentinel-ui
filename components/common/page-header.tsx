import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { GradientText } from "./gradient-text"

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  showBackButton?: boolean
  badge?: string
  badgeVariant?: "default" | "success" | "warning" | "destructive"
}

export function PageHeader({
  title,
  subtitle,
  icon,
  showBackButton = false,
  badge,
  badgeVariant = "default",
}: PageHeaderProps) {
  const badgeClasses = {
    default: "text-yellow-400 border-yellow-400 bg-yellow-950/20",
    success: "text-green-400 border-green-400 bg-green-950/20",
    warning: "text-orange-400 border-orange-400 bg-orange-950/20",
    destructive: "text-red-400 border-red-400 bg-red-950/20",
  }

  return (
    <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2">
              {icon}
              <div>
                <GradientText className="text-lg font-semibold">{title}</GradientText>
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            </div>
          </div>
          {badge && (
            <Badge variant="outline" className={badgeClasses[badgeVariant]}>
              {badge}
            </Badge>
          )}
        </div>
      </div>
    </nav>
  )
}
