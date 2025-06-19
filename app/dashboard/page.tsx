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
  Settings,
  Bell,
  Trash2,
  LogOut,
  AlertTriangle,
  CheckCircle,
  Clock,
  Grid3X3,
  Grid2X2,
  List,
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

  // New state for filtering, sorting, and viewing
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Add refresh state
  const [refreshInterval, setRefreshInterval] = useState(15) // seconds
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
        <PageHeader
          title="Dashboard"
          subtitle="Loading your wallet data..."
          icon={<Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          badge="Loading..."
        />

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* Header Actions Skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-64 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
              <Skeleton className="h-4 w-48 bg-purple-200/50 dark:bg-purple-800/30" />
            </div>
            <div className="flex gap-2">
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
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-10 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-10 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
                <div>
                  <Skeleton className="h-4 w-36 mb-2 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-10 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
                <div className="flex items-end">
                  <Skeleton className="h-10 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
              </div>
            </CardContent>
          </GradientCard>

          {/* Controls Skeleton */}
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-9 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-2 flex-1">
                    <Skeleton className="h-9 flex-1 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-9 flex-1 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-9 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                </div>
              </div>
            </CardContent>
          </GradientCard>

          {/* Wallet Cards Skeleton */}
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <GradientCard
                key={i}
                className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                    <Skeleton className="h-8 w-8 bg-purple-200/50 dark:bg-purple-800/30" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1 bg-purple-200/50 dark:bg-purple-800/30" />
                      <Skeleton className="h-10 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1 bg-purple-200/50 dark:bg-purple-800/30" />
                        <Skeleton className="h-6 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                      </div>
                      <Skeleton className="h-6 w-16 bg-purple-200/50 dark:bg-purple-800/30" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-1 bg-purple-200/50 dark:bg-purple-800/30" />
                      <Skeleton className="h-10 w-full bg-purple-200/50 dark:bg-purple-800/30" />
                    </div>
                  </div>
                </div>
              </GradientCard>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
      <PageHeader
        title="Dashboard"
        subtitle="Manage your wallets"
        icon={<Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        badge={`${wallets.length} Wallets`}
      />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              <GradientText>Welcome back, {user?.email}</GradientText>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor your Aptos wallets and stay alert</p>
          </div>

          {/* Desktop Navigation */}
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
              onClick={handleSignOut}
              className="border-purple-300/50 dark:border-purple-700/50 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-900/30 dark:to-blue-900/30 backdrop-blur-sm hover:from-purple-100/80 hover:to-blue-100/80 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav isAuthenticated={true} onSignOut={handleSignOut} currentPath="/dashboard" />
          </div>
        </div>

        {/* Add Wallet Form */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
          <CardHeader>
            <CardTitle>Add New Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div>
                <Label htmlFor="threshold">Alert Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  placeholder="Threshold"
                />
              </div>
              <div>
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  placeholder="Optional nickname"
                />
              </div>
              <div className="flex items-end">
                <GradientButton onClick={handleAddWallet}>Add Wallet</GradientButton>
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Controls */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="View Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="small-grid">Small Grid</SelectItem>
                    <SelectItem value="large-grid">Large Grid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                    <SelectItem value="threshold">Threshold</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="created">Created</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex gap-2 flex-1">
                  <Button onClick={() => setAutoRefresh(!autoRefresh)}>
                    {autoRefresh ? "Disable Auto-Refresh" : "Enable Auto-Refresh"}
                  </Button>
                  <Input
                    type="number"
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    placeholder="Refresh Interval (seconds)"
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setViewMode("list")}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setViewMode("small-grid")}>
                    <Grid2X2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setViewMode("large-grid")}>
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Wallet Cards */}
        <div className={getGridClasses()}>
          {filteredAndSortedWallets.map((wallet) => (
            <GradientCard
              key={wallet.id}
              className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <GradientText className="text-xl font-bold">{wallet.nickname || wallet.address}</GradientText>
                    <Badge className="mt-1">{new Date(wallet.created_at).toLocaleDateString()}</Badge>
                  </div>
                  <Button onClick={() => handleDeleteWallet(wallet.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Address</Label>
                    <Input value={wallet.address} readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label>Balance</Label>
                      {wallet.isLoading ? (
                        <Skeleton className="h-6 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                      ) : (
                        <Input value={wallet.balance?.toString() || "N/A"} readOnly />
                      )}
                    </div>
                    <Button onClick={() => handleUpdateThreshold(wallet.id, wallet.threshold)}>Update Threshold</Button>
                  </div>
                  <div>
                    <Label>Threshold</Label>
                    <Input value={wallet.threshold.toString()} readOnly />
                  </div>
                </div>
              </div>
            </GradientCard>
          ))}
        </div>
      </div>
    </div>
  )
}
