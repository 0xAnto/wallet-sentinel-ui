"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { AppLogo } from "./app-logo"
import { ThemeToggle } from "../theme-toggle"

interface MobileNavProps {
  children?: React.ReactNode
  showAuth?: boolean
  isConfigured?: boolean
}

export function MobileNav({ children, showAuth = true, isConfigured = true }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] bg-gradient-to-br from-gray-950 via-purple-950 to-black border-gray-800"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <AppLogo size="sm" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-col space-y-4 flex-1">
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-gray-800/50 transition-colors"
              >
                Pricing
              </Link>

              {children}
            </nav>

            <div className="flex flex-col space-y-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Theme</span>
                <ThemeToggle />
              </div>

              {showAuth &&
                (isConfigured ? (
                  <Link href="/auth" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-gray-700 text-gray-400">
                    Setup Required
                  </Button>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
