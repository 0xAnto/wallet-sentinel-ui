"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SettingsIcon, Save } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { PageHeader } from "@/components/common/page-header"
import { getCurrentUser } from "@/lib/auth"
import { getUserSettings, updateUserSettings } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [notificationFrequency, setNotificationFrequency] = useState("immediate")
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
        title="Settings"
        subtitle="Manage your notification preferences"
        icon={<SettingsIcon className="h-6 w-6 text-blue-400" />}
        showBackButton={true}
      />

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
                <p className="text-sm text-gray-400">
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
                    onClick={() => setNotificationFrequency(freq)}
                    className="capitalize"
                  >
                    {freq}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-gray-400">How often you want to receive notifications for the same wallet</p>
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
              <Label className="text-sm text-gray-400">Email Address</Label>
              <div className="text-lg">{user?.email}</div>
            </div>
            <div>
              <Label className="text-sm text-gray-400">Account Created</Label>
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
