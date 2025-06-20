"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Plus,
  Settings,
  Bell,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  Grid2X2,
  List,
  Wallet,
  RefreshCw,
} from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { PageHeader } from "@/components/common/page-header"
import { getCurrentUser, signOut } from "@/lib/auth"
import {
  getUserWallets,
  addWallet,
  deleteWallet,
  updateWallet,
  fetchWalletBalance,
  getNotificationHistory,
  type Notification,
} from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"
import { MobileNav } from "@/components/common/mobile-nav"
import { AppLogo } from "@/components/common/app-logo"
import { DashboardActions } from "@/components/common/dashboard-actions"

interface WalletWithBalance {
  id: string
  address: string
  threshold: number
  nickname?: string
  balance?: number
  isLoading?: boolean
  created_at: string
  updated_at: string
}

type ViewMode = "list" | "small-grid" | "large-grid"
type SortOption = "name" | "balance" | "threshold" | "status" | "created"
type FilterOption = "all" | "healthy" | "warning" | "alert"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [wallets, setWallets] = useState<WalletWithBalance[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [newAddress, setNewAddress] = useState("")
  const [newThreshold, setNewThreshold] = useState(10)
  const [newNickname, setNewNickname] = useState("")
  const [showAddWallet, setShowAddWallet] = useState(false)

  // New state for filtering, sorting, and viewing
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Add refresh state
  const [refreshInterval, setRefreshInterval] = useState(60) // seconds
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()

      if (!currentUser) {
        router.push("/auth")
        return
      }

      setUser(currentUser)
      await loadData(currentUser.id)
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/auth")
    } finally {
      setLoading(false)
    }
  }

  const loadData = async (userId: string) => {
    try {
      const [walletsData, notificationsData] = await Promise.all([
        getUserWallets(userId),
        getNotificationHistory(userId),
      ])

      setWallets(walletsData)
      setNotifications(notificationsData)

      // Fetch balances for all wallets
      for (const wallet of walletsData) {
        fetchBalance(wallet.id, wallet.address)
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please check your database connection.",
        variant: "destructive",
      })
    }
  }

  const fetchBalance = async (walletId: string, address: string) => {
    setWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, isLoading: true } : w)))

    try {
      const balance = await fetchWalletBalance(address)
      setWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, balance, isLoading: false } : w)))
    } catch (error) {
      console.error("Error fetching balance:", error)
      setWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, isLoading: false } : w)))
    }
  }

  const handleAddWallet = async () => {
    if (!newAddress.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (!newAddress.startsWith("0x") || newAddress.length < 10) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid wallet address starting with 0x",
        variant: "destructive",
      })
      return
    }

    try {
      const wallet = await addWallet({
        user_id: user.id,
        address: newAddress.trim(),
        threshold: newThreshold,
        nickname: newNickname.trim() || undefined,
      })

      setWallets((prev) => [...prev, wallet])
      setNewAddress("")
      setNewThreshold(10)
      setNewNickname("")

      // Fetch balance for new wallet
      fetchBalance(wallet.id, wallet.address)

      toast({
        title: "Wallet Added",
        description: "Wallet has been added to monitoring",
      })
    } catch (error) {
      console.error("Error adding wallet:", error)
      toast({
        title: "Error",
        description: "Failed to add wallet. Please check your database connection.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWallet = async (walletId: string) => {
    try {
      await deleteWallet(walletId)
      setWallets((prev) => prev.filter((w) => w.id !== walletId))
      toast({
        title: "Wallet Removed",
        description: "Wallet has been removed from monitoring",
      })
    } catch (error) {
      console.error("Error deleting wallet:", error)
      toast({
        title: "Error",
        description: "Failed to remove wallet",
        variant: "destructive",
      })
    }
  }

  const handleUpdateThreshold = async (walletId: string, newThreshold: number) => {
    try {
      await updateWallet(walletId, { threshold: newThreshold })
      setWallets((prev) => prev.map((w) => (w.id === walletId ? { ...w, threshold: newThreshold } : w)))
      toast({
        title: "Threshold Updated",
        description: "Alert threshold has been updated",
      })
    } catch (error) {
      console.error("Error updating threshold:", error)
      toast({
        title: "Error",
        description: "Failed to update threshold",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getBalanceStatus = (balance: number, threshold: number) => {
    if (balance < threshold)
      return {
        color: "bg-red-900 text-red-200 border-red-700",
        status: "Alert",
        icon: AlertTriangle,
        level: "alert",
      }
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

  // Filter and sort wallets
  const filteredAndSortedWallets = wallets
    .filter((wallet) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (wallet.nickname && wallet.nickname.toLowerCase().includes(searchQuery.toLowerCase()))

      // Status filter
      if (filterBy === "all") return matchesSearch

      if (wallet.balance === undefined) return matchesSearch

      const status = getBalanceStatus(wallet.balance, wallet.threshold)
      return matchesSearch && status.level === filterBy
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          const nameA = a.nickname || a.address
          const nameB = b.nickname || b.address
          return nameA.localeCompare(nameB)
        case "balance":
          return (b.balance || 0) - (a.balance || 0)
        case "threshold":
          return b.threshold - a.threshold
        case "status":
          if (a.balance === undefined || b.balance === undefined) return 0
          const statusA = getBalanceStatus(a.balance, a.threshold)
          const statusB = getBalanceStatus(b.balance, b.threshold)
          const statusOrder = { alert: 0, warning: 1, healthy: 2 }
          return (
            statusOrder[statusA.level as keyof typeof statusOrder] -
            statusOrder[statusB.level as keyof typeof statusOrder]
          )
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const getGridClasses = () => {
    switch (viewMode) {
      case "list":
        return "grid grid-cols-1 gap-3"
      case "small-grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      case "large-grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }
  }

  const handleRefresh = async () => {
    if (!user || isRefreshing) return

    setIsRefreshing(true)
    try {
      // Fetch balances for all wallets
      const refreshPromises = wallets.map((wallet) => fetchBalance(wallet.id, wallet.address))
      await Promise.all(refreshPromises)

      toast({
        title: "Refreshed",
        description: "Wallet balances updated successfully",
      })
    } catch (error) {
      console.error("Error refreshing balances:", error)
      toast({
        title: "Refresh Error",
        description: "Failed to refresh some wallet balances",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !user || wallets.length === 0) return

    const interval = setInterval(() => {
      handleRefresh()
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, user, wallets.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black">
        <PageHeader
          title="Dashboard"
          subtitle="Monitor your wallet balances and alerts"
          icon={<Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          badge="Loading..."
        />

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 bg-purple-200/50 dark:bg-purple-800/30" />
              <Skeleton className="h-4 w-48 bg-purple-200/50 dark:bg-purple-800/30" />
            </div>
            <div className="hidden md:flex gap-2">
              <Skeleton className="h-10 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
              <Skeleton className="h-10 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
              <Skeleton className="h-10 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
            </div>
          </div>

          {/* Add Wallet Form Skeleton */}
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-purple-200/50 dark:bg-purple-800/30" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-10 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-10 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-10 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-10 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>
            </CardContent>
          </GradientCard>

          {/* Controls Skeleton */}
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-9 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-2 flex-1">
                    <Skeleton className="h-9 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-9 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-9 w-20 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                </div>
              </div>
            </CardContent>
          </GradientCard>

          {/* Wallet Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <GradientCard
                key={i}
                className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-8 w-8 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-8 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-8 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-8 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                </CardContent>
              </GradientCard>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-lg">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor your wallet balances and alerts"
        icon={<AppLogo showText="false" />}
        badge={`${wallets.length} wallets monitored`}
        badgeVariant="success"
      />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              <GradientText>Welcome back, </GradientText>
              <GradientText variant="green-emerald">{user?.email}</GradientText>
            </h1>
          </div>

          {/* Desktop Actions */}
          <DashboardActions onSignOut={handleSignOut} />

          {/* Mobile Navigation */}
          <MobileNav showAuth={false}>
            <Link
              href="/notifications"
              className="text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-gray-800/50 transition-colors flex items-center"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Link>
            <Link
              href="/settings"
              className="text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-gray-800/50 transition-colors flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white py-2 px-4 rounded-md hover:bg-gray-800/50 transition-colors flex items-center text-left w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </MobileNav>
        </div>

        {/* Add Wallet Toggle Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            <GradientText variant="blue-cyan">Wallet Management</GradientText>
          </h2>
          <GradientButton
            onClick={() => setShowAddWallet(!showAddWallet)}
            variant="outline"
            className="border-purple-300/50 dark:border-purple-700/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showAddWallet ? "Hide Add Wallet" : "Add New Wallet"}
          </GradientButton>
        </div>

        {/* Collapsible Add Wallet Form */}
        {showAddWallet && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <GradientText>Add New Wallet</GradientText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x1a2b3c4d5e6f..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"
                  />
                </div>
                <div>
                  <Label htmlFor="nickname">Nickname (Optional)</Label>
                  <Input
                    id="nickname"
                    placeholder="My Main Wallet"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"
                  />
                </div>
                <div>
                  <Label htmlFor="threshold">Alert Threshold (APT)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number.parseFloat(e.target.value) || 10)}
                    className="bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"
                  />
                </div>
                <div className="flex items-end">
                  <GradientButton onClick={handleAddWallet} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Wallet
                  </GradientButton>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        )}

        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              {/* Search Bar - Full Width on Mobile */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400 dark:text-purple-500" />
                  <Input
                    placeholder="Search wallets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-10 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"
                  />
                </div>
              </div>

              {/* Controls Row - Stacked on Mobile, Row on Desktop */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Filter and Sort Controls */}
                <div className="flex gap-2 flex-1 sm:max-w-none">
                  <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                    <SelectTrigger className="flex-1 sm:w-[120px] h-9 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm text-sm">
                      <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="flex-1 sm:w-[120px] h-9 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm text-sm">
                      <SortAsc className="h-4 w-4 mr-2 flex-shrink-0" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="balance">Balance</SelectItem>
                      <SelectItem value="threshold">Threshold</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Refresh and View Controls */}
                <div className="flex gap-2">
                  {/* Refresh Controls */}
                  <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 px-2 py-1 rounded-lg border border-purple-300/30 dark:border-purple-600/30 backdrop-blur-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="h-7 px-2 text-xs hover:bg-purple-200/50 dark:hover:bg-purple-800/30"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                      <span className="hidden xs:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                      <span className="xs:hidden">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>

                    <div className="h-4 w-px bg-purple-300/50 dark:bg-purple-600/50" />

                    <Select
                      value={refreshInterval.toString()}
                      onValueChange={(value) => setRefreshInterval(Number(value))}
                    >
                      <SelectTrigger className="w-12 h-7 bg-transparent border-none text-xs p-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5s</SelectItem>
                        <SelectItem value="10">10s</SelectItem>
                        <SelectItem value="15">15s</SelectItem>
                        <SelectItem value="30">30s</SelectItem>
                        <SelectItem value="60">1m</SelectItem>
                        <SelectItem value="300">5m</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`h-7 w-7 p-0 ${
                        autoRefresh ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex gap-0.5 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 p-0.5 rounded-lg border border-purple-300/30 dark:border-purple-600/30 backdrop-blur-sm">
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-7 w-7 p-0"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={viewMode === "small-grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("small-grid")}
                      className="h-7 w-7 p-0"
                    >
                      <Grid3X3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={viewMode === "large-grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("large-grid")}
                      className="h-7 w-7 p-0"
                    >
                      <Grid2X2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Wallets Display */}
        <div className={getGridClasses()}>
          {filteredAndSortedWallets.map((wallet, index) => {
            const status = wallet.balance !== undefined ? getBalanceStatus(wallet.balance, wallet.threshold) : null
            const StatusIcon = status?.icon
            const walletName = wallet.nickname || `Wallet ${wallet.address.slice(0, 8)}...`

            // Common card classes
            const cardClasses = `
      hover:border-purple-400/60 dark:hover:border-purple-600/60 transition-all duration-300 
      backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 
      border border-purple-200/30 dark:border-purple-700/30
      ${viewMode === "list" ? "flex-row" : "flex-col"}
    `

            // Common input classes
            const inputClasses =
              "bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/30 dark:border-purple-700/30 backdrop-blur-sm text-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"

            const renderListMode = () => (
              <div className="w-full">
                {/* Mobile Layout */}
                <div className="block md:hidden p-3 space-y-3">
                  {/* Header with name and delete button */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium truncate" title={walletName}>
                        <GradientText variant="blue-cyan">{walletName}</GradientText>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex-shrink-0 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Address - Mobile */}
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Address</Label>
                    <div className={`font-mono ${inputClasses} p-2 rounded border text-xs break-all`}>
                      {`${wallet.address.slice(0, 12)}...${wallet.address.slice(-8)}`}
                    </div>
                  </div>

                  {/* Balance and Status Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Balance</Label>
                      {wallet.isLoading ? (
                        <Skeleton className="h-6 w-20 bg-purple-200/50 dark:bg-purple-800/30" />
                      ) : wallet.balance !== undefined ? (
                        <div className="font-bold text-base">
                          <GradientText variant="green-emerald">{wallet.balance.toFixed(2)} APT</GradientText>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">Loading...</div>
                      )}
                    </div>

                    {/* Status Badge */}
                    {status && (
                      <div className="ml-3">
                        <Badge
                          className={`${status.color} border backdrop-blur-sm text-xs flex items-center px-2 py-1`}
                        >
                          {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                          <span className="hidden xs:inline">{status.status}</span>
                          <span className="xs:hidden">{status.status.charAt(0)}</span>
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Threshold Input */}
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Alert Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={wallet.threshold}
                        onChange={(e) =>
                          handleUpdateThreshold(wallet.id, Number.parseFloat(e.target.value) || wallet.threshold)
                        }
                        className={`${inputClasses} flex-1 text-sm`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">APT</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center w-full p-4 gap-4 border-b">
                  {/* Wallet Name */}
                  <div className="w-40 flex-shrink-0">
                    <div className="text-lg truncate" title={walletName}>
                      <GradientText variant="blue-cyan">{walletName}</GradientText>
                    </div>
                  </div>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Wallet Address */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-mono ${inputClasses} p-2 rounded border truncate`}>{wallet.address}</div>
                  </div>

                  {/* Balance */}
                  <div className="w-24 text-right">
                    {wallet.isLoading ? (
                      <Skeleton className="h-6 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                    ) : wallet.balance !== undefined ? (
                      <div className="font-bold text-lg">
                        <GradientText variant="green-emerald">{wallet.balance.toFixed(2)} APT</GradientText>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Loading...</div>
                    )}
                  </div>

                  {/* Threshold */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={wallet.threshold}
                      onChange={(e) =>
                        handleUpdateThreshold(wallet.id, Number.parseFloat(e.target.value) || wallet.threshold)
                      }
                      className={`${inputClasses} w-24`}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">APT</span>
                  </div>

                  {/* Status */}
                  {status && (
                    <div className="w-24">
                      <Badge
                        className={`w-full justify-center ${status.color} border backdrop-blur-sm text-xs flex items-center`}
                      >
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        {status.status}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )

            // Render grid mode layout
            const renderGridMode = () => (
              <>
                <CardHeader className={`${viewMode === "small-grid" ? "pb-2 px-3 pt-3" : "pb-3"}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={viewMode === "small-grid" ? "text-sm sm:text-base" : "text-base sm:text-lg"}>
                      <GradientText variant="blue-cyan">
                        {viewMode === "small-grid" && wallet.nickname
                          ? wallet.nickname.length > 12
                            ? `${wallet.nickname.slice(0, 12)}...`
                            : wallet.nickname
                          : walletName}
                      </GradientText>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="h-7 w-7 p-0 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className={`space-y-3 ${viewMode === "small-grid" ? "px-3 pb-3" : ""}`}>
                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Address</Label>
                    <div
                      className={`font-mono ${inputClasses} p-2 rounded border break-all ${
                        viewMode === "small-grid" ? "text-xs" : "text-xs sm:text-sm"
                      }`}
                    >
                      {viewMode === "small-grid"
                        ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-4)}`
                        : window.innerWidth < 640
                          ? `${wallet.address.slice(0, 16)}...${wallet.address.slice(-8)}`
                          : wallet.address}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Current Balance</Label>
                    {wallet.isLoading ? (
                      <Skeleton className="h-6 sm:h-8 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                    ) : wallet.balance !== undefined ? (
                      <div
                        className={`font-bold ${
                          viewMode === "small-grid" ? "text-base sm:text-lg" : "text-lg sm:text-2xl"
                        }`}
                      >
                        <GradientText variant="green-emerald">{wallet.balance.toFixed(2)} APT</GradientText>
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-500 text-sm">Loading...</div>
                    )}
                  </div>

                  {/* Threshold section - Always show on mobile for better UX */}
                  <div className={viewMode === "small-grid" ? "block" : "block"}>
                    <Label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Alert Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={wallet.threshold}
                        onChange={(e) =>
                          handleUpdateThreshold(wallet.id, Number.parseFloat(e.target.value) || wallet.threshold)
                        }
                        className={`${inputClasses} text-sm`}
                      />
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">APT</span>
                    </div>
                  </div>

                  {status && (
                    <div className="flex items-center justify-between">
                      <Badge className={`${status.color} border backdrop-blur-sm text-xs flex items-center px-2 py-1`}>
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        <span className="hidden xs:inline">{status.status}</span>
                        <span className="xs:hidden">{status.status.charAt(0)}</span>
                      </Badge>
                      {viewMode === "small-grid" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                          Threshold: {wallet.threshold} APT
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </>
            )

            return (
              <GradientCard key={wallet.id} className={cardClasses}>
                {viewMode === "list" ? renderListMode() : renderGridMode()}
              </GradientCard>
            )
          })}
        </div>

        {filteredAndSortedWallets.length === 0 && wallets.length > 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Wallets Found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </GradientCard>
        )}

        {wallets.length === 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="text-center py-12">
              <Wallet className="h-12 w-12 text-purple-400 dark:text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Wallets Added</h3>
              <p className="text-gray-500 dark:text-gray-500">
                Add your first wallet to start monitoring balances and receiving alerts.
              </p>
            </CardContent>
          </GradientCard>
        )}
      </div>
    </div>
  )
}
