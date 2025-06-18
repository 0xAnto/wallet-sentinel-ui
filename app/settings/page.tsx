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
import { getCurrentUser } from "@/lib/auth"
import { getUserSettings, updateUserSettings } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"

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
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/auth")
        return
      }
      setUser(currentUser)
      await loadSettings(currentUser.id)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
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
            <h1 className="text-2xl font-bold">
              <GradientText>Settings</GradientText>
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Notification Settings */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
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
                  className="bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm"
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
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100/80 to-white/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-lg border border-gray-300/30 dark:border-gray-700/30 backdrop-blur-sm"
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
                {emailAddresses.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No notification emails added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </GradientCard>

        {/* Account Information */}
        <GradientCard className="backdrop-blur-md bg-gradient-to-br from-white/90 to-gray-100/90 dark:from-gray-900/90 dark:to-gray-800/90 border border-white/20 dark:border-gray-700/50">
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
