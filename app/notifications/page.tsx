"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bell,
  ArrowLeft,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  Mail,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { checkAuthStatus } from "@/lib/auth"
import { getNotificationHistory, deleteNotification, type Notification } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"

type FilterOption = "all" | "alert" | "warning" | "healthy"
type SortOption = "date" | "balance" | "threshold"

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { user, session } = await checkAuthStatus()
      if (!user || !session) {
        router.push("/auth")
        return
      }
      setUser(user)
      await loadNotifications(user.id)
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/auth")
    } finally {
      setLoading(false)
    }
  }

  const loadNotifications = async (userId: string) => {
    try {
      const notificationsData = await getNotificationHistory(userId)
      setNotifications(notificationsData)
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    if (!user) return
    setRefreshing(true)
    try {
      await loadNotifications(user.id)
      toast({
        title: "Refreshed",
        description: "Notifications have been updated",
      })
    } catch (error) {
      console.error("Error refreshing notifications:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      toast({
        title: "Notification Deleted",
        description: "Notification has been removed",
      })
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getStatusInfo = (balance: number, threshold: number) => {
    if (balance < threshold)
      return { color: "bg-red-900 text-red-200 border-red-700", status: "Alert", icon: AlertTriangle, level: "alert" }
    if (balance < threshold * 1.5)
      return {
        color: "bg-yellow-900 text-yellow-200 border-yellow-700",
        status: "Warning",
        icon: Clock,
        level: "warning",
      }
    return {
      color: "bg-green-900 text-green-200 border-green-700",
      status: "Healthy",
      icon: CheckCircle,
      level: "healthy",
    }
  }

  // Filter and sort notifications
  const filteredAndSortedNotifications = notifications
    .filter((notification) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        notification.wallet_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (notification.wallet_nickname && notification.wallet_nickname.toLowerCase().includes(searchQuery.toLowerCase()))

      // Status filter
      if (filterBy === "all") return matchesSearch

      const status = getStatusInfo(notification.balance, notification.threshold)
      return matchesSearch && status.level === filterBy
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
        case "balance":
          return a.balance - b.balance
        case "threshold":
          return b.threshold - a.threshold
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
        {/* Header Skeleton */}
        <div className="border-b border-purple-200/50 dark:border-purple-800/50 backdrop-blur-md bg-purple-50/80 dark:bg-purple-900/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 bg-purple-200/50 dark:bg-purple-800/30" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-8 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
              <Skeleton className="h-10 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <GradientCard
                key={i}
                className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 bg-purple-200/50 dark:bg-purple-800/30" />
                    <div>
                      <Skeleton className="h-4 w-32 bg-purple-200/50 dark:bg-purple-800/30 mb-2" />
                      <Skeleton className="h-8 w-16 bg-purple-200/50 dark:bg-purple-800/30" />
                    </div>
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>

          {/* Filters Skeleton */}
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Skeleton className="h-10 flex-1 max-w-md bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-10 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-10 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>
            </CardContent>
          </GradientCard>

          {/* Notifications List Skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <GradientCard
                key={i}
                className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-16 bg-purple-200/50 dark:bg-purple-800/30" />
                        <Skeleton className="h-4 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-12 bg-purple-200/50 dark:bg-purple-800/30" />
                          <Skeleton className="h-6 w-48 bg-purple-200/50 dark:bg-purple-800/30" />
                        </div>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                          <Skeleton className="h-4 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
      {/* Header */}
      <div className="p-4 border-b border-purple-200/50 dark:border-purple-800/50 backdrop-blur-md bg-purple-50/80 dark:bg-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-bold">
                <GradientText>Notifications</GradientText>
              </h1>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/settings">
              <Button
                variant="outline"
                className="border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-blue-600 dark:text-blue-400"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Mobile Actions Row */}
        <div className="sm:hidden mt-3 flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-1 border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/settings" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</p>
                  <p className="text-2xl font-bold">
                    <GradientText>{notifications.length}</GradientText>
                  </p>
                </div>
              </div>
            </CardContent>
          </GradientCard>

          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alert Notifications</p>
                  <p className="text-2xl font-bold">
                    <GradientText variant="red-orange">
                      {notifications.filter((n) => getStatusInfo(n.balance, n.threshold).level === "alert").length}
                    </GradientText>
                  </p>
                </div>
              </div>
            </CardContent>
          </GradientCard>

          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold">
                    <GradientText variant="green-emerald">
                      {
                        notifications.filter(
                          (n) => new Date(n.sent_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        ).length
                      }
                    </GradientText>
                  </p>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </div>

        {/* Filters */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400 dark:text-purple-500" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"
                />
              </div>

              <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                <SelectTrigger className="w-[140px] bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[140px] bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="threshold">Threshold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </GradientCard>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredAndSortedNotifications.map((notification) => {
            const status = getStatusInfo(notification.balance, notification.threshold)
            const StatusIcon = status.icon

            return (
              <GradientCard
                key={notification.id}
                className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30 hover:border-purple-400/60 dark:hover:border-purple-600/60 transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${status.color} border backdrop-blur-sm`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.status}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(notification.sent_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Wallet:</Label>
                          <span className="font-mono text-sm bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 px-2 py-1 rounded border border-purple-300/30 dark:border-purple-700/30">
                            {notification.wallet_nickname || `${notification.wallet_address.slice(0, 12)}...`}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-gray-600 dark:text-gray-400">Balance:</Label>
                            <span className="font-semibold">
                              <GradientText variant="green-emerald">{notification.balance.toFixed(2)} APT</GradientText>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-gray-600 dark:text-gray-400">Threshold:</Label>
                            <span className="font-semibold">{notification.threshold} APT</span>
                          </div>
                        </div>

                        {notification.notification_emails && notification.notification_emails.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Sent to: {notification.notification_emails.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </GradientCard>
            )
          })}
        </div>

        {filteredAndSortedNotifications.length === 0 && notifications.length > 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Notifications Found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </GradientCard>
        )}

        {notifications.length === 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Notifications Yet</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                You'll see notifications here when wallet balances drop below your alert thresholds.
              </p>
              <Link href="/settings">
                <GradientButton>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Notifications
                </GradientButton>
              </Link>
            </CardContent>
          </GradientCard>
        )}
      </div>
    </div>
  )
}
