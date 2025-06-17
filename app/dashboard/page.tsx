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
import { Shield, Plus, Settings, Bell, Trash2, LogOut, AlertTriangle, CheckCircle, Clock } from "lucide-react"
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
  type Wallet,
  type Notification,
} from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"

interface WalletWithBalance extends Wallet {
  balance?: number
  isLoading?: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [wallets, setWallets] = useState<WalletWithBalance[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [newAddress, setNewAddress] = useState("")
  const [newThreshold, setNewThreshold] = useState(10)
  const [newNickname, setNewNickname] = useState("")
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
        description: "Failed to load wallet data",
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
    if (!newAddress.trim() || !user) return

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
        description: "Failed to add wallet",
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
    await signOut()
    router.push("/")
  }

  const getBalanceStatus = (balance: number, threshold: number) => {
    if (balance < threshold)
      return { color: "bg-red-900 text-red-200 border-red-700", status: "Alert", icon: AlertTriangle }
    if (balance < threshold * 1.5)
      return { color: "bg-yellow-900 text-yellow-200 border-yellow-700", status: "Warning", icon: Clock }
    return { color: "bg-green-900 text-green-200 border-green-700", status: "Healthy", icon: CheckCircle }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white">
      <PageHeader
        title="Dashboard"
        subtitle="Monitor your wallet balances and alerts"
        icon={<Shield className="h-6 w-6 text-blue-400" />}
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
            <p className="text-gray-400">Monitor your Aptos wallets and stay alert</p>
          </div>
          <div className="flex gap-2">
            <Link href="/settings">
              <Button variant="outline" className="border-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="border-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Add Wallet Form */}
        <GradientCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-400" />
              <GradientText>Add New Wallet</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  placeholder="0x..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="nickname">Nickname (Optional)</Label>
                <Input
                  id="nickname"
                  placeholder="My Main Wallet"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="bg-gray-800 border-gray-700"
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
                  className="bg-gray-800 border-gray-700"
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

        {/* Wallets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet, index) => {
            const status = wallet.balance !== undefined ? getBalanceStatus(wallet.balance, wallet.threshold) : null
            const StatusIcon = status?.icon

            return (
              <GradientCard key={wallet.id} className="hover:border-gray-600 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <GradientText variant="blue-cyan">
                        {wallet.nickname || `Wallet ${wallet.address.slice(0, 8)}...`}
                      </GradientText>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="h-8 w-8 p-0 hover:bg-gray-700/50 text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">Address</Label>
                    <div className="font-mono text-sm bg-gray-800 p-2 rounded border border-gray-700 break-all">
                      {wallet.address}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400">Current Balance</Label>
                    {wallet.isLoading ? (
                      <Skeleton className="h-8 w-full bg-gray-800" />
                    ) : wallet.balance !== undefined ? (
                      <div className="text-2xl font-bold">
                        <GradientText variant="green-emerald">{wallet.balance.toFixed(2)} APT</GradientText>
                      </div>
                    ) : (
                      <div className="text-gray-500">Loading...</div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400">Alert Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={wallet.threshold}
                        onChange={(e) =>
                          handleUpdateThreshold(wallet.id, Number.parseFloat(e.target.value) || wallet.threshold)
                        }
                        className="bg-gray-800 border-gray-700 text-sm"
                      />
                      <span className="text-sm text-gray-400">APT</span>
                    </div>
                  </div>

                  {status && (
                    <div className="flex items-center justify-between">
                      <Badge className={`${status.color} border`}>
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        {status.status}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </GradientCard>
            )
          })}
        </div>

        {wallets.length === 0 && (
          <GradientCard>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Wallets Added</h3>
              <p className="text-gray-500">Add your first wallet to start monitoring balances and receiving alerts.</p>
            </CardContent>
          </GradientCard>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <GradientCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-400" />
                <GradientText variant="yellow-orange">Recent Notifications</GradientText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <div className="font-mono text-sm text-gray-300">
                        {notification.wallet_address.slice(0, 12)}...
                      </div>
                      <div className="text-sm text-gray-400">
                        Balance {notification.balance.toFixed(2)} APT dropped below {notification.threshold} APT
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(notification.sent_at).toLocaleDateString()}</div>
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
