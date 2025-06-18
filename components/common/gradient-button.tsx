import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GradientButtonProps extends ButtonProps {
  variant?: "blue-purple" | "green-emerald" | "purple-pink" | "red-orange"
}

export function GradientButton({ className, variant = "blue-purple", ...props }: GradientButtonProps) {
  const variants = {
    "blue-purple": "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    "green-emerald":
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white",
    "purple-pink": "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
    "red-orange": "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white",
  }

  return <Button className={cn(variants[variant], className)} {...props} />
}
