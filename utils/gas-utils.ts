export const formatBalance = (balance: string): string => {
  const aptBalance = Number.parseFloat(balance) / 100000000 // Convert from octas to APT
  return aptBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export const getBalanceStatus = (balance: string) => {
  const aptBalance = Number.parseFloat(balance) / 100000000
  if (aptBalance >= 10) return { color: "bg-green-900 text-green-200 border-green-700", status: "Healthy" }
  if (aptBalance >= 5) return { color: "bg-yellow-900 text-yellow-200 border-yellow-700", status: "Medium" }
  return { color: "bg-red-900 text-red-200 border-red-700", status: "Low" }
}

export const getTotalBalance = (wallets: Array<{ balance: string; error?: string }>): number => {
  return wallets.reduce((total, wallet) => {
    if (!wallet.error) {
      return total + Number.parseFloat(wallet.balance) / 100000000
    }
    return total
  }, 0)
}

export const fetchBalance = async (address: string): Promise<{ balance: string; error?: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 500))

  // Return dummy balance or simulate random error
  if (Math.random() < 0.1) {
    // 10% chance of error
    return { balance: "0", error: "Network timeout" }
  }

  // Use predefined dummy balance or generate random one
  const DUMMY_BALANCES = {
    "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890": "125000000000", // 1250 APT
    "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab": "75500000000", // 755 APT
    "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd": "42300000000", // 423 APT
    "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef": "18750000000", // 187.5 APT
    "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12": "9200000000", // 92 APT
  }

  const dummyBalance =
    DUMMY_BALANCES[address as keyof typeof DUMMY_BALANCES] || Math.floor(Math.random() * 100000000000).toString()

  return { balance: dummyBalance }
}
