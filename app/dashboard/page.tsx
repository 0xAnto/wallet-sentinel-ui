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
import { Shield, Plus, Settings, Bell, Trash2, LogOut, AlertTriangle, CheckCircle, Clock, Mail, X } from 'lucide-react'
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
  getUserSettings,
  updateUserSettings,
  type Wallet,
  type Notification,
  type UserSettings,
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
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [newAddress, setNewAddress] = useState("")
  const [newThreshold, setNewThreshold] = useState(10)
  const [newNickname, setNewNickname] = useState("")
  const [newEmail, setNewEmail] = useState("")
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

      const [walletsData, notificationsData, settingsData] = await Promise.all([
        getUserWallets(userId),
        getNotificationHistory(userId),
        getUserSettings(userId),
      ])

      console.log("Loaded wallets:", walletsData)
      console.log("Loaded notifications:", notificationsData)
      console.log("Loaded settings:", settingsData)

      setWallets(walletsData)
      setNotifications(notificationsData)
      setSettings(settingsData)

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

  const handleAddEmail = async () => {
    if (!newEmail.trim() || !user) return

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    try {
      const currentEmails = settings?.notification_emails || []
      if (currentEmails.includes(newEmail.trim())) {
        toast({
          title: "Email Already Added",
          description: "This email is already in your notification list",
          variant: "destructive",
        })
        return
      }

      const updatedSettings = await updateUserSettings(user.id, {
        notification_emails: [...currentEmails, newEmail.trim()],
      })

      setSettings(updatedSettings)
      setNewEmail("")

      toast({
        title: "Email Added",
        description: "Email has been added to notification list",
      })
    } catch (error) {
      console.error("Error adding email:", error)
      toast({
        title: "Error",
        description: "Failed to add email",
        variant: "destructive",
      })
    }
  }

  const handleRemoveEmail = async (emailToRemove: string) => {
    if (!user || !settings) return

    try {
      const updatedEmails = settings.notification_emails.filter((email) => email !== emailToRemove)
      const updatedSettings = await updateUserSettings(user.id, {
        notification_emails: updatedEmails,
      })

      setSettings(updatedSettings)

      toast({
        title: "Email Removed",
        description: "Email has been removed from notification list",
      })
    } catch (error) {
      console.error("Error removing email:", error)
      toast({
        title: "Error",
        description: "Failed to remove email",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFrequency = async (frequency: 'hourly' | 'daily') => {
    if (!user) return

    try {
      const updatedSettings = await updateUserSettings(user.id, {
        notification_frequency: frequency,
      })

      setSettings(updatedSettings)

      toast({
        title: "Frequency Updated",
        description: `Notification frequency set to ${frequency}`,
      })
    } catch (error) {
      console.error("Error updating frequency:", error)
      toast({
        title: "Error",
        description: "Failed to update frequency",
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
      return { color: "bg-red-900 text-red-200 border-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-700", status: "Alert", icon: AlertTriangle }
    if (balance < threshold * 1.5)
      return { color: "bg-yellow-900 text-yellow-200 border-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700", status: "Warning", icon: Clock }
    return { color: "bg-green-900 text-green-200 border-green-700 dark:bg-green-900 dark:text-green-200 dark:border-green-700", status: "Healthy", icon: CheckCircle }
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
              <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="border-gray-300 dark:border-gray-700">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <GradientCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <GradientText>Notification Settings</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Management */}
            <div>
              <Label className="text-base font-medium">Notification Emails</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Add email addresses to receive low balance alerts
              </p>
              
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                />
                <GradientButton onClick={handleAddEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Add
                </GradientButton>
              </div>

              <div className="space-y-2">
                {settings?.notification_emails?.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm">{email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!settings?.notification_emails || settings.notification_emails.length === 0) && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No notification emails added yet</p>
                )}
              </div>
            </div>

            {/* Frequency Settings */}
            <div>
              <Label className="text-base font-medium">Alert Frequency</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                How often to send notifications for the same wallet
              </p>
              <div className="flex gap-2">
                <Button
                  variant={settings?.notification_frequency === 'hourly' ? "default" : "outline"}
                  onClick={() => handleUpdateFrequency('hourly')}
                  className="flex-1"
                >
                  Hourly
                </Button>
                <Button
                  variant={settings?.notification_frequency === 'daily' ? "default" : "outline"}
                  onClick={() => handleUpdateFrequency('daily')}
                  className="flex-1"
                >
                  Daily
                </Button>
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Add Wallet Form */}
        <GradientCard>
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
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="nickname">Nickname (Optional)</Label>
                <Input
                  id="nickname"
                  placeholder="My Main Wallet"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
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
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
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
              <GradientCard key={wallet.id} className="hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300">
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
                      className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-gray-700/50 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Address</Label>
                    <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-700 break-all">
                      {wallet.address}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Current Balance</Label>
                    {wallet.isLoading ? (
                      <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-800" />
                    ) : wallet.balance !== undefined ? (
                      <div className="text-2xl font-bold">
                        <GradientText variant="green-emerald">{wallet.balance.toFixed(2)} APT</GradientText>
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-500">Loading...</div>
                    )}
                  </div>

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
                        className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-sm"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">APT</span>
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
              <Shield className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Wallets Added</h3>
              <p className="text-gray-500 dark:text-gray-500">Add your first wallet to start monitoring balances and receiving alerts.</p>
            </CardContent>
          </GradientCard>
        )}

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <GradientCard>
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
                    className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                        {notification.wallet_address.slice(0, 12)}...
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Balance {notification.balance.toFixed(2)} APT dropped below {notification.threshold} APT
                      </div>
                      {notification.notification_emails && notification.notification_emails.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Sent to: {notification.notification_emails.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-500">{new Date(notification.sent_at).toLocaleDateString()}</div>
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
