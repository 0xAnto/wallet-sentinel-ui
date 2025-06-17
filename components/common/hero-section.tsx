import type React from "react"
import { GradientText } from "./gradient-text"
import { GradientCard } from "./gradient-card"

interface HeroSectionProps {
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  stats?: {
    value: string
    label: string
    sublabel?: string
  }
}

export function HeroSection({ title, subtitle, description, icon, stats }: HeroSectionProps) {
  return (
    <GradientCard className="relative overflow-hidden rounded-2xl border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      <div className="relative p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                {icon}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  <GradientText>{title}</GradientText>
                </h1>
                <p className="text-purple-300/80">{subtitle}</p>
              </div>
            </div>
            <p className="text-gray-300 max-w-md">{description}</p>
          </div>
          {stats && (
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <GradientText variant="blue-cyan">{stats.value}</GradientText>
              </div>
              <div className="text-purple-300/80">{stats.label}</div>
              {stats.sublabel && <div className="text-sm text-gray-400 mt-1">{stats.sublabel}</div>}
            </div>
          )}
        </div>
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl"></div>
    </GradientCard>
  )
}
