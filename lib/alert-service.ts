import {
  getUserWallets,
  fetchWalletBalance,
  createNotification,
  sendEmailNotification,
  getUserSettings,
} from "./wallet-service"
import { supabase } from "./supabase"

export const checkWalletAlerts = async () => {
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    if (usersError) throw usersError

    for (const user of users.users) {
      await checkUserWalletAlerts(user.id, user.email!)
    }
  } catch (error) {
    console.error("Error checking wallet alerts:", error)
  }
}

export const checkUserWalletAlerts = async (userId: string, userEmail: string) => {
  try {
    const [wallets, settings] = await Promise.all([getUserWallets(userId), getUserSettings(userId)])

    if (!settings?.email_notifications) return

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
        await sendEmailNotification(userEmail, wallet.address, balance, wallet.threshold)
      }
    }
  } catch (error) {
    console.error(`Error checking alerts for user ${userId}:`, error)
  }
}
