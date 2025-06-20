import { Shield } from "lucide-react"
import { GradientText } from "./gradient-text"

interface AppLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function AppLogo({ size = "md", showText = "true" }: AppLogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm"></div>
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1.5 flex items-center justify-center">
          <Shield className={`${sizes[size]} text-white`} />
        </div>
      </div>
      {showText == true && <GradientText className={`font-bold ${textSizes[size]}`}>Wallet Sentinel</GradientText>}
    </div>
  )
}
