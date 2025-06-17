"use client"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Plus, Trash2, Copy, CheckCircle, AlertCircle, Fuel } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WALLET_ADDRESSES } from "../../constants"
import { formatBalance, getBalanceStatus, getTotalBalance, fetchBalance } from "../../utils/gas-utils"
import {
  topUpWallet,
  validateAptosAddress,
  isDuplicateAddress,
  type WalletBalance,
} from "../../utils/transaction-utils"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { PageHeader } from "@/components/common/page-header"
import { HeroSection } from "@/components/common/hero-section"

export default function GasTracker() {
  const [wallets, setWallets] = useState<WalletBalance[]>(
    WALLET_ADDRESSES.map((address) => ({
      address,
      balance: "0",
      isLoading: false,
    })),
  )
  const [newAddress, setNewAddress] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [globalTopUpAmount, setGlobalTopUpAmount] = useState(5)
  const [individualTopUpAmounts, setIndividualTopUpAmounts] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const fetchAllBalances = async () => {
    setIsRefreshing(true)
    const updatedWallets = await Promise.all(
      wallets.map(async (wallet) => {
        setWallets((prev) =>
          prev.map((w) => (w.address === wallet.address ? { ...w, isLoading: true, error: undefined } : w)),
        )

        const result = await fetchBalance(wallet.address)
        return {
          ...wallet,
          balance: result.balance,
          isLoading: false,
          error: result.error,
        }
      }),
    )

    setWallets(updatedWallets)
    setIsRefreshing(false)
    toast({
      title: "Balances Updated",
      description: "All wallet balances have been refreshed.",
    })
  }

  const addWallet = () => {
    const validation = validateAptosAddress(newAddress)
    if (!validation.isValid) {
      toast({
        title: "Invalid Address",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    if (isDuplicateAddress(wallets, newAddress)) {
      toast({
        title: "Duplicate Address",
        description: "This wallet address is already being tracked.",
        variant: "destructive",
      })
      return
    }

    const newWallet = {
      address: newAddress.trim(),
      balance: "0",
      isLoading: false,
    }

    setWallets((prev) => [...prev, newWallet])
    setIndividualTopUpAmounts((prev) => ({ ...prev, [newAddress.trim()]: 5 }))
    setNewAddress("")
    toast({
      title: "Wallet Added",
      description: "New wallet address has been added to tracking.",
    })
  }

  const removeWallet = (address: string) => {
    setWallets((prev) => prev.filter((w) => w.address !== address))
    setIndividualTopUpAmounts((prev) => {
      const newAmounts = { ...prev }
      delete newAmounts[address]
      return newAmounts
    })
    toast({
      title: "Wallet Removed",
      description: "Wallet address has been removed from tracking.",
    })
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to clipboard.",
    })
  }

  const handleIndividualTopUp = (address: string) => {
    const amount = individualTopUpAmounts[address] || 5
    setWallets((prev) => topUpWallet(prev, address, amount))
    toast({
      title: "Wallet Topped Up",
      description: `Added ${amount} APT to wallet`,
    })
  }

  const handleTopUpAll = () => {
    setWallets((prev) =>
      prev.map((wallet) => {
        if (!wallet.error) {
          const currentBalance = Number.parseFloat(wallet.balance)
          const topUpInOctas = globalTopUpAmount * 100000000
          const newBalance = (currentBalance + topUpInOctas).toString()
          return { ...wallet, balance: newBalance }
        }
        return wallet
      }),
    )
    toast({
      title: "All Wallets Topped Up",
      description: `Added ${globalTopUpAmount} APT to all wallets`,
    })
  }

  const updateIndividualTopUpAmount = (address: string, amount: number) => {
    setIndividualTopUpAmounts((prev) => ({
      ...prev,
      [address]: Math.min(Math.max(amount, 1), 999), // Limit between 1-999
    }))
  }

  // Initialize individual top-up amounts
  useEffect(() => {
    const initialAmounts: Record<string, number> = {}
    WALLET_ADDRESSES.forEach((address) => {
      initialAmounts[address] = 5
    })
    setIndividualTopUpAmounts(initialAmounts)
  }, [])

  useEffect(() => {
    fetchAllBalances()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white">
      <PageHeader
        title="Gas Tracker"
        subtitle="Monitor & Manage Your Wallet Balances"
        icon={<Fuel className="h-6 w-6 text-blue-400" />}
        showBackButton={true}
        badge="Demo Mode"
      />

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <HeroSection
          title="Aptos Gas Tracker"
          subtitle="Monitor & Manage Your Wallet Balances"
          description="Keep track of multiple Aptos wallets, monitor gas balances, and top up when needed. Never run out of gas for your transactions again."
          icon={<Fuel className="h-6 w-6 text-white" />}
          stats={{
            value: `${getTotalBalance(wallets).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} APT`,
            label: "Total Portfolio Value",
            sublabel: `Across ${wallets.length} wallet${wallets.length !== 1 ? "s" : ""}`,
          }}
        />

        {/* Topup All Wallets */}
        <GradientCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-400" />
              <GradientText>Topup All Wallets</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="globalTopup" className="text-gray-300 whitespace-nowrap">
                  Amount (APT):
                </Label>
                <Input
                  id="globalTopup"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={globalTopUpAmount}
                  onChange={(e) => setGlobalTopUpAmount(Number.parseFloat(e.target.value) || 5)}
                  className="w-24 bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-white"
                />
              </div>
              <GradientButton onClick={handleTopUpAll} className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Top Up All Wallets
              </GradientButton>
            </div>
          </CardContent>
        </GradientCard>

        {/* Add Wallet Section */}
        <GradientCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-400" />
              <GradientText>Add New Wallet</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="address" className="sr-only">
                  Wallet Address
                </Label>
                <Input
                  id="address"
                  placeholder="Enter Aptos wallet address (0x...)"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && addWallet()}
                />
              </div>
              <GradientButton onClick={addWallet}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </GradientButton>
            </div>
          </CardContent>
        </GradientCard>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            <GradientText variant="blue-cyan">Wallet Balances</GradientText>
          </h2>
          <GradientButton variant="green-emerald" onClick={fetchAllBalances} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh All
          </GradientButton>
        </div>

        {/* Wallet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet, index) => {
            const balanceStatus = getBalanceStatus(wallet.balance)
            const individualAmount = individualTopUpAmounts[wallet.address] || 5

            return (
              <GradientCard
                key={wallet.address}
                className="hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <GradientText variant="blue-cyan">Wallet #{index + 1}</GradientText>
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAddress(wallet.address)}
                        className="h-8 w-8 p-0 hover:bg-gray-700/50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWallet(wallet.address)}
                        className="h-8 w-8 p-0 hover:bg-gray-700/50 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">Address</Label>
                    <div className="font-mono text-sm bg-gradient-to-r from-gray-800 to-gray-700 p-2 rounded border border-gray-600 break-all">
                      {wallet.address}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400">Balance</Label>
                    {wallet.isLoading ? (
                      <Skeleton className="h-8 w-full bg-gradient-to-r from-gray-800 to-gray-700" />
                    ) : wallet.error ? (
                      <Alert className="border-red-700 bg-gradient-to-r from-red-950/50 to-red-900/30">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">{wallet.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="text-2xl font-bold">
                        <GradientText variant="green-emerald">{formatBalance(wallet.balance)} APT</GradientText>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={wallet.error ? "destructive" : "secondary"}
                      className={
                        wallet.error ? "bg-red-900 text-red-200 border-red-700" : `${balanceStatus.color} border`
                      }
                    >
                      {wallet.error ? (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {balanceStatus.status}
                        </>
                      )}
                    </Badge>

                    {!wallet.error && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">+</span>
                        <Input
                          type="number"
                          min="1"
                          max="999"
                          value={individualAmount}
                          onChange={(e) =>
                            updateIndividualTopUpAmount(wallet.address, Number.parseInt(e.target.value) || 5)
                          }
                          className="w-12 h-6 text-xs bg-gray-800 border-gray-600 text-center p-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleIndividualTopUp(wallet.address)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs px-2"
                        >
                          APT
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </GradientCard>
            )
          })}
        </div>

        {wallets.length === 0 && (
          <GradientCard>
            <CardContent className="text-center py-12">
              <Fuel className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Wallets Added</h3>
              <p className="text-gray-500">Add your first Aptos wallet address to start tracking balances.</p>
            </CardContent>
          </GradientCard>
        )}
      </div>
    </div>
  )
}
