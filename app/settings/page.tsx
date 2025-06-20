"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsIcon, Save, Plus, ArrowLeft, Mail, X, Bell } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { checkAuthStatus } from "@/lib/auth"
import { getUserSettings, updateUserSettings } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { Skeleton } from "@/components/ui/skeleton"

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState<"immediate" | "hourly" | "daily">("daily")
  const [emailAddresses, setEmailAddresses] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      await loadSettings(user.id)
    } catch (error) {
      console.error("Error checking user:", error)
      router.push("/auth")
    } finally {
      setLoading(false)
    }
  }

  const loadSettings = async (userId: string) => {
    try {
      const settings = await getUserSettings(userId)
      if (settings) {
        setEmailNotifications(settings.email_notifications)
        setNotificationFrequency(settings.notification_frequency)
        setEmailAddresses(settings.notification_emails || [])
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      await updateUserSettings(user.id, {
        email_notifications: emailNotifications,
        notification_frequency: notificationFrequency,
        notification_emails: emailAddresses,
      })

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddEmail = async () => {
    if (!newEmail || !user) return

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

    // Check for duplicates
    if (emailAddresses.includes(newEmail)) {
      toast({
        title: "Duplicate Email",
        description: "This email is already in your notification list",
        variant: "destructive",
      })
      return
    }

    try {
      setEmailAddresses([...emailAddresses, newEmail])
      setNewEmail("")
      toast({
        title: "Email Added",
        description: "Email address added to notification list",
      })
    } catch (error) {
      console.error("Error adding email:", error)
      toast({
        title: "Error",
        description: "Failed to add email address",
        variant: "destructive",
      })
    }
  }

  const handleRemoveEmail = async (email: string) => {
    if (!user) return

    try {
      setEmailAddresses(emailAddresses.filter((e) => e !== email))
      toast({
        title: "Email Removed",
        description: "Email address removed from notification list",
      })
    } catch (error) {
      console.error("Error removing email:", error)
      toast({
        title: "Error",
        description: "Failed to remove email address",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
        {/* Header Skeleton */}
        <div className="border-b border-purple-200/50 dark:border-purple-800/50 backdrop-blur-md bg-purple-50/80 dark:bg-purple-900/20 p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 bg-purple-200/50 dark:bg-purple-800/30" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 bg-purple-200/50 dark:bg-purple-800/30" />
              <Skeleton className="h-8 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Notification Settings Skeleton */}
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-6 w-48 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-4 w-80 bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
                <Skeleton className="h-10 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-10 w-20 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-10 w-16 bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
                <Skeleton className="h-4 w-64 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-56 bg-purple-200/50 dark:bg-purple-800/30" />
                <Skeleton className="h-4 w-48 bg-purple-200/50 dark:bg-purple-800/30" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 bg-purple-200/50 dark:bg-purple-800/30" />
                  <Skeleton className="h-10 w-20 bg-purple-200/50 dark:bg-purple-800/30" />
                </div>
              </div>
            </CardContent>
          </GradientCard>

          {/* Account Information Skeleton */}
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-purple-200/50 dark:bg-purple-800/30" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 bg-purple-200/50 dark:bg-purple-800/30 mb-2" />
                <Skeleton className="h-6 w-64 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 bg-purple-200/50 dark:bg-purple-800/30 mb-2" />
                <Skeleton className="h-6 w-48 bg-purple-200/50 dark:bg-purple-800/30" />
              </div>
            </CardContent>
          </GradientCard>

          {/* Save Button Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32 bg-purple-200/50 dark:bg-purple-800/30" />
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
              <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-bold">
                <GradientText>Settings</GradientText>
              </h1>
            </div>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Mobile Theme Toggle */}
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Notification Settings */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <GradientText>Notification Settings</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Enable Email Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email notifications when wallet balances drop below thresholds
                </p>
              </div>
              <Button
                variant={emailNotifications ? "default" : "outline"}
                onClick={() => setEmailNotifications(!emailNotifications)}
                className="ml-4"
              >
                {emailNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <div className="flex gap-2">
                {["immediate", "hourly", "daily"].map((freq) => (
                  <Button
                    key={freq}
                    variant={notificationFrequency === freq ? "default" : "outline"}
                    onClick={() => setNotificationFrequency(freq as "immediate" | "hourly" | "daily")}
                    className="capitalize"
                  >
                    {freq}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How often you want to receive notifications for the same wallet
              </p>
            </div>

            {/* Email Management */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Notification Email Addresses</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add email addresses to receive low balance alerts
              </p>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 border-purple-300/40 dark:border-purple-600/40 backdrop-blur-sm focus:border-purple-500/60 dark:focus:border-purple-400/60"
                  onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                />
                <GradientButton onClick={handleAddEmail} disabled={!newEmail}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </GradientButton>
              </div>

              <div className="space-y-2">
                {emailAddresses.map((email, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 rounded-lg border border-purple-300/30 dark:border-purple-700/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm">{email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                      className="h-8 w-8 p-0 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {emailAddresses.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No notification emails added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Account Information */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
          <CardHeader>
            <CardTitle>
              <GradientText>Account Information</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">Email Address</Label>
              <div className="text-lg">{user?.email}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 dark:text-gray-400">Account Created</Label>
              <div className="text-lg">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Save Button */}
        <div className="flex justify-end">
          <GradientButton onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </GradientButton>
        </div>
      </div>
    </div>
  )
}
