import { fetchWalletBalance, createNotification, sendEmailNotification, getUserSettings } from "./wallet-service"
import { supabase } from "./supabase"

export const checkWalletAlerts = async () => {
  try {
    // Get all users with wallets
    const { data: wallets, error } = await supabase.from("wallets").select("*, user_id")

    if (error) throw error

    // Group wallets by user
    const userWallets = wallets.reduce((acc: any, wallet: any) => {
      if (!acc[wallet.user_id]) {
        acc[wallet.user_id] = []
      }
      acc[wallet.user_id].push(wallet)
      return acc
    }, {})

    // Check alerts for each user
    for (const [userId, userWalletList] of Object.entries(userWallets)) {
      await checkUserWalletAlerts(userId, userWalletList as any[])
    }
  } catch (error) {
    console.error("Error checking wallet alerts:", error)
  }
}

export const checkUserWalletAlerts = async (userId: string, wallets: any[]) => {
  try {
    const settings = await getUserSettings(userId)

    if (!settings?.email_notifications) return

    // Get user email from auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError || !user.user?.email) return

    for (const wallet of wallets) {
      const balance = await fetchWalletBalance(wallet.address)

      if (balance < wallet.threshold) {
        // Create notification record
        await createNotification({
          user_id: userId,
          wallet_id: wallet.id,
          wallet_address: wallet.address,
          balance,
          threshold: wallet.threshold,
          email_sent: true,
        })

        // Send email notification
        await sendEmailNotification(user.user.email, wallet.address, balance, wallet.threshold)
      }
    }
  } catch (error) {
    console.error(`Error checking alerts for user ${userId}:`, error)
  }
}
