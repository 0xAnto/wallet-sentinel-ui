"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserSettings, updateUserSettings, addEmailAddress, removeEmailAddress } from "@/lib/wallet-service"
import { useToast } from "@/hooks/use-toast"

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
      setEmailAddresses(emailAddresses.filter(e => e !== email))
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify\
