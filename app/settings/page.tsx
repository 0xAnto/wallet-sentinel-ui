"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsIcon, Plus, Trash2 } from "lucide-react"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { PageHeader } from "@/components/common/page-header"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex flex-col items-center justify-center">
      <PageHeader title="Settings" icon={SettingsIcon} />
      <GradientCard className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Label>Email Notifications</Label>
            <Button onClick={() => setEmailNotifications(!emailNotifications)}>
              {emailNotifications ? "Enabled" : "Disabled"}
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <Label>Notification Frequency</Label>
            <select
              value={notificationFrequency}
              onChange={(e) => setNotificationFrequency(e.target.value as "immediate" | "hourly" | "daily")}
              className="bg-white text-black p-2 rounded"
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div className="mb-4">
            <Label>Email Addresses</Label>
            <ul className="list-disc pl-6">
              {emailAddresses.map((email, index) => (
                <li key={index} className="flex items-center justify-between">
                  {email}
                  <Button onClick={() => handleRemoveEmail(email)} className="ml-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Add new email address"
              className="w-full mr-2"
            />
            <GradientButton onClick={handleAddEmail}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </GradientButton>
          </div>
        </CardContent>
      </GradientCard>
      <ThemeToggle />
    </div>
  )
}
