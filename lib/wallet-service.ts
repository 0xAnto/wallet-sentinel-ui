import { supabase, isSupabaseConfigured } from "./supabase"

export interface Wallet {
  id: string
  user_id: string
  address: string
  threshold: number
  nickname: string | null
  created_at: string
  updated_at: string
}

export interface WalletInsert {
  user_id: string
  address: string
  threshold: number
  nickname?: string | null
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
  console.log(`Sending email to ${email}: Wallet ${wallet} balance ${balance} APT is below threshold ${threshold} APT`)
  await new Promise((resolve) => setTimeout(resolve, 100))
  return true
}

export const getUserWallets = async (userId: string): Promise<Wallet[]> => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured, returning empty wallets")
      return []
    }

    const { data, error } = await supabase!
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
    console.error("getUserWallets error:", error)
    return []
  }
}

export const addWallet = async (wallet: WalletInsert): Promise<Wallet> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Database not configured")
    }

    const { data, error } = await supabase!.from("wallets").insert(wallet).select().single()

    if (error) {
      console.error("Error adding wallet:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("addWallet error:", error)
    throw error
  }
}

export const updateWallet = async (id: string, updates: Partial<Wallet>): Promise<Wallet> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Database not configured")
    }

    const { data, error } = await supabase!
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
    console.error("updateWallet error:", error)
    throw error
  }
}

export const deleteWallet = async (id: string): Promise<void> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Database not configured")
    }

    const { error } = await supabase!.from("wallets").delete().eq("id", id)

    if (error) {
      console.error("Error deleting wallet:", error)
      throw error
    }
  } catch (error) {
    console.error("deleteWallet error:", error)
    throw error
  }
}

export const getNotificationHistory = async (userId: string): Promise<Notification[]> => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured, returning empty notifications")
      return []
    }

    const { data, error } = await supabase!
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
    console.error("getNotificationHistory error:", error)
    return []
  }
}

export const createNotification = async (notification: Omit<Notification, "id" | "sent_at">): Promise<void> => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Database not configured")
    }

    const { error } = await supabase!.from("notifications").insert(notification)

    if (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  } catch (error) {
    console.error("createNotification error:", error)
    throw error
  }
}

export const getUserSettings = async (userId: string) => {
  try {
    if (!isSupabaseConfigured()) {
      return null
    }

    const { data, error } = await supabase!.from("user_settings").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user settings:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("getUserSettings error:", error)
    return null
  }
}

export const updateUserSettings = async (userId: string, settings: any) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Database not configured")
    }

    const { data, error } = await supabase!
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
  } catch (error) {
    console.error("updateUserSettings error:", error)
    throw error
  }
}
