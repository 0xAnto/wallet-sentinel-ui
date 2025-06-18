"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsIcon, Save, Plus, Trash2, ArrowLeft } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { getCurrentUser } from "@/lib/auth"
import { getUserSettings, updateUserSettings, addEmailAddress, removeEmailAddress } from "@/lib/wallet-service"
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
        setEmailAddresses(settings.email_addresses || [])
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
        email_addresses: emailAddresses,
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
      await addEmailAddress(user.id, newEmail)
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
      await removeEmailAddress(user.id, email)
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black dark:from-gray-950 dark:via-purple-950 dark:to-black light:from-purple-50 light:via-blue-50 light:to-indigo-100 flex items-center justify-center">
        <div className="text-white dark:text-white light:text-gray-900">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black dark:from-gray-950 dark:via-purple-950 dark:to-black light:from-purple-50 light:via-blue-50 light:to-indigo-100 text-white dark:text-white light:text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-blue-400" />
            <h1 className="text-2xl font-bold">
              <GradientText>Settings</GradientText>
            </h1>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Email Notifications */}
        <GradientCard>
          <CardHeader>
            <CardTitle>
              <GradientText>Email Notifications</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Enable Email Alerts</Label>
                <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
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
              <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                How often you want to receive notifications for the same wallet
              </p>
            </div>

            {/* Email Addresses Management */}
            <div className="space-y-4">
              <Label>Email Addresses</Label>

              {/* Add new email */}
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Add new email address"
                  className="flex-1"
                />
                <GradientButton onClick={handleAddEmail} disabled={!newEmail}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </GradientButton>
              </div>

              {/* Email list */}
              {emailAddresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                    Current email addresses:
                  </p>
                  {emailAddresses.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-white/50 rounded-lg border border-gray-700 dark:border-gray-700 light:border-gray-200"
                    >
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </GradientCard>

        {/* Account Information */}
        <GradientCard>
          <CardHeader>
            <CardTitle>
              <GradientText>Account Information</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Email Address</Label>
              <div className="text-lg">{user?.email}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Account Created</Label>
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
