"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, Settings, LogOut } from "lucide-react"

interface DashboardActionsProps {
  onSignOut: () => void
}

export function DashboardActions({ onSignOut }: DashboardActionsProps) {
  return (
    <div className="hidden md:flex gap-2">
      <Link href="/notifications">
        <Button
          variant="outline"
          className="border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm hover:from-purple-100/80 hover:to-blue-100/80 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </Link>
      <Link href="/settings">
        <Button
          variant="outline"
          className="border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm hover:from-purple-100/80 hover:to-blue-100/80 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </Link>
      <Button
        variant="outline"
        onClick={onSignOut}
        className="border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm hover:from-purple-100/80 hover:to-blue-100/80 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
