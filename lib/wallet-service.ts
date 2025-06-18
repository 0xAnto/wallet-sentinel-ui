import { supabase } from "./supabase"

export interface Wallet {
  id: string
  user_id: string
  address: string
  nickname?: string
  threshold: number
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  wallet_id: string
  wallet_address: string
  wallet_nickname?: string
  balance: number
  threshold: number
  notification_emails: string[]
  sent_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  email_notifications: boolean
  notification_frequency: "immediate" | "hourly" | "daily"
  notification_emails: string[]
  created_at: string
  updated_at: string
}

// Wallet operations
export async function getUserWallets(userId: string): Promise<Wallet[]> {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching wallets:", error)
    throw error
  }

  return data || []
}

export async function addWallet(wallet: Omit<Wallet, "id" | "created_at" | "updated_at">): Promise<Wallet> {
  const { data, error } = await supabase.from("wallets").insert([wallet]).select().single()

  if (error) {
    console.error("Error adding wallet:", error)
    throw error
  }

  return data
}

export async function updateWallet(walletId: string, updates: Partial<Wallet>): Promise<Wallet> {
  const { data, error } = await supabase
    .from("wallets")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", walletId)
    .select()
    .single()

  if (error) {
    console.error("Error updating wallet:", error)
    throw error
  }

  return data
}

export async function deleteWallet(walletId: string): Promise<void> {
  const { error } = await supabase.from("wallets").delete().eq("id", walletId)

  if (error) {
    console.error("Error deleting wallet:", error)
    throw error
  }
}

// Mock balance fetching (replace with real API)
export async function fetchWalletBalance(address: string): Promise<number> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock balance based on address
  const hash = address.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  return Math.abs(hash % 100) + Math.random() * 50
}

// Notification operations
export async function getNotificationHistory(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("sent_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }

  return data || []
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

  if (error) {
    console.error("Error deleting notification:", error)
    throw error
  }
}

// User settings operations
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user settings:", error)
    throw error
  }

  return data
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error updating user settings:", error)
    throw error
  }

  return data
}

export async function addEmailAddress(userId: string, email: string): Promise<void> {
  const settings = await getUserSettings(userId)
  const currentEmails = settings?.notification_emails || []

  await updateUserSettings(userId, {
    notification_emails: [...currentEmails, email],
  })
}

export async function removeEmailAddress(userId: string, email: string): Promise<void> {
  const settings = await getUserSettings(userId)
  const currentEmails = settings?.notification_emails || []

  await updateUserSettings(userId, {
    notification_emails: currentEmails.filter((e) => e !== email),
  })
}
