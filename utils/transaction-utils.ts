export interface WalletBalance {
  address: string
  balance: string
  isLoading: boolean
  error?: string
}

export const topUpWallet = (wallets: WalletBalance[], address: string, topUpAmount: number): WalletBalance[] => {
  return wallets.map((wallet) => {
    if (wallet.address === address) {
      const currentBalance = Number.parseFloat(wallet.balance)
      const topUpInOctas = topUpAmount * 100000000 // Convert APT to octas
      const newBalance = (currentBalance + topUpInOctas).toString()
      return { ...wallet, balance: newBalance }
    }
    return wallet
  })
}

export const validateAptosAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address.trim()) {
    return { isValid: false, error: "Address cannot be empty" }
  }

  if (!address.trim().startsWith("0x") || address.trim().length < 10) {
    return { isValid: false, error: "Please enter a valid Aptos wallet address starting with 0x." }
  }

  return { isValid: true }
}

export const isDuplicateAddress = (wallets: WalletBalance[], address: string): boolean => {
  return wallets.some((w) => w.address === address.trim())
}
