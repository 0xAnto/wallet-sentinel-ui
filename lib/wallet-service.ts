import { supabase } from "./supabase"

export interface Wallet {
  id: string
  user_id: string
  address: string
  threshold: number
  nickname: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  wallet_id: string
  wallet_address: string
  balance: number
  threshold: number
  sent_at: string
  email_sent: boolean
}

export interface UserSettings {
  id: string
  user_id: string
  email_notifications: boolean
  notification_frequency: string
  created_at: string
  updated_at: string
}

export const fetchWalletBalance = async (address: string): Promise<number> => {
  // Mock function - replace with actual Aptos API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simulate different balance scenarios
  const mockBalances: Record<string, number> = {
    "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890": 1250.75,
    "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab": 755.5,
    "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd": 423.25,
    "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef": 187.5,
    "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12": 92.0,
  }

  return mockBalances[address] || Math.random() * 1000
}

export const sendEmailNotification = async (email: string, wallet: string, balance: number, threshold: number) => {
  // Mock function - replace with actual email service
  console.log(`📧 Email Alert: ${email}`)
  console.log(`Wallet: ${wallet}`)
  console.log(`Balance: ${balance} APT (below threshold: ${threshold} APT)`)
  await new Promise((resolve) => setTimeout(resolve, 100))
  return true
}

export const getUserWallets = async (userId: string): Promise<Wallet[]> => {
  try {
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
  } catch (error) {
    console.error("Failed to get user wallets:", error)
    throw error
  }
}

export const addWallet = async (wallet: Omit<Wallet, "id" | "created_at" | "updated_at">): Promise<Wallet> => {
  try {
    const { data, error } = await supabase
      .from("wallets")
      .insert({
        ...wallet,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding wallet:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to add wallet:", error)
    throw error
  }
}

export const updateWallet = async (id: string, updates: Partial<Wallet>): Promise<Wallet> => {
  try {
    const { data, error } = await supabase
      .from("wallets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating wallet:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to update wallet:", error)
    throw error
  }
}

export const deleteWallet = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("wallets").delete().eq("id", id)

    if (error) {
      console.error("Error deleting wallet:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to delete wallet:", error)
    throw error
  }
}

export const getNotificationHistory = async (userId: string): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("sent_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching notifications:", error)
      throw error
    }
    return data || []
  } catch (error) {
    console.error("Failed to get notifications:", error)
    throw error
  }
}

export const createNotification = async (notification: Omit<Notification, "id" | "sent_at">): Promise<void> => {
  try {
    const { error } = await supabase.from("notifications").insert({
      ...notification,
      sent_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  } catch (error) {
    console.error("Failed to create notification:", error)
    throw error
  }
}

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching settings:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to get user settings:", error)
    return null
  }
}

export const updateUserSettings = async (
  userId: string,
  settings: Partial<Omit<UserSettings, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<UserSettings> => {
  try {
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
      console.error("Error updating settings:", error)
      throw error
    }
    return data
  } catch (error) {
    console.error("Failed to update user settings:", error)
    throw error
  }
}
