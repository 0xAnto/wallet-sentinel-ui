"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, Bell, Settings, LogOut, Home, DollarSign } from "lucide-react"
import { GradientText } from "./gradient-text"
import { ThemeToggle } from "@/components/theme-toggle"

interface MobileNavProps {
  isAuthenticated?: boolean
  onSignOut?: () => void
  currentPath?: string
}

export function MobileNav({ isAuthenticated = false, onSignOut, currentPath }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleLinkClick = () => {
    setOpen(false)
  }

  const handleSignOut = () => {
    onSignOut?.()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] bg-gradient-to-br from-gray-950 via-purple-950 to-black border-gray-800"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold">
                <GradientText>Wallet Sentinel</GradientText>
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6">
            <div className="space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link href="/" onClick={handleLinkClick}>
                    <Button
                      variant={currentPath === "/" ? "secondary" : "ghost"}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Home className="h-4 w-4 mr-3" />
                      Home
                    </Button>
                  </Link>
                  <Link href="/pricing" onClick={handleLinkClick}>
                    <Button
                      variant={currentPath === "/pricing" ? "secondary" : "ghost"}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <DollarSign className="h-4 w-4 mr-3" />
                      Pricing
                    </Button>
                  </Link>
                  <Link href="/auth" onClick={handleLinkClick}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" onClick={handleLinkClick}>
                    <Button
                      variant={currentPath === "/dashboard" ? "secondary" : "ghost"}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/notifications" onClick={handleLinkClick}>
                    <Button
                      variant={currentPath === "/notifications" ? "secondary" : "ghost"}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={handleLinkClick}>
                    <Button
                      variant={currentPath === "/settings" ? "secondary" : "ghost"}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                  <div className="pt-4 border-t border-gray-800 mt-4">
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
