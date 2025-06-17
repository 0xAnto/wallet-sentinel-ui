"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, Shield, ArrowRight, Github, Twitter } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-blue-400" />
              <GradientText className="text-xl font-bold">Aptos Tools</GradientText>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/gas-tracker">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Gas Tracker
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border-blue-500/30 mb-4">
              🚀 Now Live on Aptos Mainnet
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <GradientText className="block">Aptos Wallet</GradientText>
              <GradientText variant="green-emerald" className="block">
                Management Suite
              </GradientText>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Monitor, manage, and optimize your Aptos wallets with our comprehensive suite of tools. Track gas
              balances, manage multiple wallets, and stay on top of your portfolio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/gas-tracker">
              <GradientButton size="lg" className="text-lg px-8 py-3">
                Launch Gas Tracker
                <ArrowRight className="ml-2 h-5 w-5" />
              </GradientButton>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-3"
            >
              View Documentation
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <GradientCard variant="feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">
                  <GradientText variant="blue-cyan">Multi-Wallet Tracking</GradientText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Monitor multiple Aptos wallets simultaneously. Track balances, set alerts, and manage your entire
                  portfolio from one dashboard.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard variant="feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">
                  <GradientText variant="green-emerald">Real-time Analytics</GradientText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Get instant insights into your wallet performance with real-time balance updates and comprehensive
                  analytics.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard variant="feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">
                  <GradientText variant="purple-pink">Secure & Private</GradientText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Your wallet data stays secure with client-side processing. No private keys or sensitive data stored on
                  our servers.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">
                <GradientText variant="blue-cyan">10K+</GradientText>
              </div>
              <div className="text-gray-400">Wallets Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                <GradientText variant="green-emerald">$2M+</GradientText>
              </div>
              <div className="text-gray-400">Total Value Monitored</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                <GradientText variant="purple-pink">99.9%</GradientText>
              </div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                <GradientText variant="yellow-orange">24/7</GradientText>
              </div>
              <div className="text-gray-400">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Wallet className="h-6 w-6 text-blue-400" />
              <GradientText className="text-lg font-semibold">Aptos Tools</GradientText>
            </div>
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-gray-400">
            <p>&copy; 2024 Aptos Tools. Built for the Aptos ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
