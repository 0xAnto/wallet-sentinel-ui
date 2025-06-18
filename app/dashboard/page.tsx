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

interface WalletWithBalance {
  balance?: number
  isLoading?: boolean
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
  const [viewMode, setViewMode] = useState<ViewMode>("large-grid")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      console.log("Current user:", currentUser)

      if (!currentUser) {
        console.log("No user found, redirecting to auth")
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
      console.log("Loading data for user:", userId)

      const [walletsData, notificationsData] = await Promise.all([
        getUserWallets(userId),
        getNotificationHistory(userId),
      ])

      console.log("Loaded wallets:", walletsData)
      console.log("Loaded notifications:", notificationsData)

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
        nickname: newNickname.trim() || null,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-lg">Loading dashboard...</div>
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
        icon={<Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        showBackButton={true}
        badge={`${wallets.length} wallets monitored`}
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
          <div className="flex gap-2">
            <Link href="/settings">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 bg-gradient-to-r from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-gray-300 dark:border-gray-700 bg-gradient-to-r from-white/80 to-gray-100/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Add Wallet Form */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
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
                  className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label htmlFor="nickname">Nickname (Optional)</Label>
                <Input
                  id="nickname"
                  placeholder="My Main Wallet"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
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
                  className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
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

        {/* Filters and Controls */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search wallets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
                  />
                </div>

                <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                  <SelectTrigger className="w-[140px] bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm">
                    <Filter className="h-4 w-4 mr-2" />
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
                  <SelectTrigger className="w-[140px] bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm">
                    <SortAsc className="h-4 w-4 mr-2" />
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

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gradient-to-r from-white/60 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-900/60 p-1 rounded-lg border border-gray-300/30 dark:border-gray-600/30 backdrop-blur-sm">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "small-grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("small-grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "large-grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("large-grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Wallets Display */}
        <div className={getGridClasses()}>
          {filteredAndSortedWallets.map((wallet, index) => {
            const status = wallet.balance !== undefined ? getBalanceStatus(wallet.balance, wallet.threshold) : null
            const StatusIcon = status?.icon

            return (
              <GradientCard
                key={wallet.id}
                className={`
                  hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 
                  backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 
                  border border-white/20 dark:border-gray-700/50
                  ${viewMode === "list" ? "flex-row" : "flex-col"}
                `}
              >
                <CardHeader className={`${viewMode === "list" ? "pb-3 flex-shrink-0" : "pb-3"}`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${viewMode === "small-grid" ? "text-base" : "text-lg"}`}>
                      <GradientText variant="blue-cyan">
                        {wallet.nickname || `Wallet ${wallet.address.slice(0, 8)}...`}
                      </GradientText>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-gray-700/50 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className={`space-y-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Address</Label>
                    <div
                      className={`font-mono bg-gradient-to-r from-gray-100/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 p-2 rounded border border-gray-300/30 dark:border-gray-700/30 backdrop-blur-sm break-all ${viewMode === "small-grid" ? "text-xs" : "text-sm"}`}
                    >
                      {viewMode === "small-grid"
                        ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}`
                        : wallet.address}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Current Balance</Label>
                    {wallet.isLoading ? (
                      <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-800" />
                    ) : wallet.balance !== undefined ? (
                      <div className={`font-bold ${viewMode === "small-grid" ? "text-lg" : "text-2xl"}`}>
                        <GradientText variant="green-emerald">{wallet.balance.toFixed(2)} APT</GradientText>
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-500">Loading...</div>
                    )}
                  </div>

                  {viewMode !== "small-grid" && (
                    <div>
                      <Label className="text-sm text-gray-600 dark:text-gray-400">Alert Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={wallet.threshold}
                          onChange={(e) =>
                            handleUpdateThreshold(wallet.id, Number.parseFloat(e.target.value) || wallet.threshold)
                          }
                          className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm text-sm"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">APT</span>
                      </div>
                    </div>
                  )}

                  {status && (
                    <div className="flex items-center justify-between">
                      <Badge className={`${status.color} border backdrop-blur-sm`}>
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        {status.status}
                      </Badge>
                      {viewMode === "small-grid" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Threshold: {wallet.threshold} APT
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </GradientCard>
            )
          })}
        </div>

        {filteredAndSortedWallets.length === 0 && wallets.length > 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Wallets Found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
            </CardContent>
          </GradientCard>
        )}

        {wallets.length === 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
            <CardContent className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Wallets Added</h3>
              <p className="text-gray-500 dark:text-gray-500">
                Add your first wallet to start monitoring balances and receiving alerts.
              </p>
            </CardContent>
          </GradientCard>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <GradientText variant="yellow-orange">Recent Notifications</GradientText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-lg border border-gray-300/30 dark:border-gray-700/30 backdrop-blur-sm"
                  >
                    <div>
                      <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                        {notification.wallet_address.slice(0, 12)}...
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Balance {notification.balance.toFixed(2)} APT dropped below {notification.threshold} APT
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(notification.sent_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GradientCard>
        )}
      </div>
    </div>
  )
}
