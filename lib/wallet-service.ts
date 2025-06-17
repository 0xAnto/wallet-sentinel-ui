import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Wallet = Database["public"]["Tables"]["wallets"]["Row"]
type WalletInsert = Database["public"]["Tables"]["wallets"]["Insert"]
type Notification = Database["public"]["Tables"]["notifications"]["Row"]

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
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export const addWallet = async (wallet: WalletInsert): Promise<Wallet> => {
  const { data, error } = await supabase.from("wallets").insert(wallet).select().single()

  if (error) throw error
  return data
}

export const updateWallet = async (id: string, updates: Partial<Wallet>): Promise<Wallet> => {
  const { data, error } = await supabase
    .from("wallets")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteWallet = async (id: string): Promise<void> => {
  const { error } = await supabase.from("wallets").delete().eq("id", id)

  if (error) throw error
}

export const getNotificationHistory = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("sent_at", { ascending: false })
    .limit(50)

  if (error) throw error
  return data || []
}

export const createNotification = async (
  notification: Database["public"]["Tables"]["notifications"]["Insert"],
): Promise<void> => {
  const { error } = await supabase.from("notifications").insert(notification)

  if (error) throw error
}

export const getUserSettings = async (userId: string) => {
  const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export const updateUserSettings = async (
  userId: string,
  settings: Partial<Database["public"]["Tables"]["user_settings"]["Update"]>,
) => {
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}
