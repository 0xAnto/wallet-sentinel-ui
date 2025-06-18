"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Bell, ArrowRight, Github, Twitter, TrendingUp } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function HomePage() {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if Supabase is configured
    setIsConfigured(isSupabaseConfigured())
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800/50 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <GradientText className="text-xl font-bold">Wallet Sentinel</GradientText>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Pricing
                </Button>
              </Link>
              {isConfigured ? (
                <Link href="/auth">
                  <GradientButton>Get Started</GradientButton>
                </Link>
              ) : (
                <Button disabled className="bg-gray-700 text-gray-400">
                  Setup Required
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Configuration Warning */}
      {!isConfigured && (
        <div className="bg-yellow-900/20 border-b border-yellow-700/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-yellow-300">
              <Shield className="h-5 w-5" />
              <span className="text-sm">
                <strong>Setup Required:</strong> Please configure your Supabase environment variables to enable
                authentication and database features.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 mb-4 text-black">
              🚀 Never Miss a Low Balance Again
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <GradientText className="block">Wallet Sentinel</GradientText>
              <GradientText variant="green-emerald" className="block">
                Smart Alerts
              </GradientText>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Monitor your Aptos wallets 24/7 and get instant email alerts when balances drop below your custom
              thresholds. Never run out of gas for important transactions again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isConfigured ? (
              <Link href="/auth">
                <GradientButton size="lg" className="text-lg px-8 py-3">
                  Start Monitoring Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </GradientButton>
              </Link>
            ) : (
              <Button disabled size="lg" className="bg-gray-700 text-gray-400 text-lg px-8 py-3">
                Setup Required
              </Button>
            )}
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-3"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <GradientCard variant="feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">
                  <GradientText variant="blue-cyan">Smart Alerts</GradientText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Set custom balance thresholds for each wallet and receive instant email notifications when balances
                  drop below your limits.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard variant="feature">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">
                  <GradientText variant="green-emerald">Real-time Monitoring</GradientText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Continuous 24/7 monitoring of your wallet balances with real-time updates and comprehensive dashboard
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
                  Your wallet addresses are stored securely. We only monitor balances - never access your private keys
                  or funds.
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
                <GradientText variant="blue-cyan">1K+</GradientText>
              </div>
              <div className="text-gray-400">Wallets Monitored</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                <GradientText variant="green-emerald">$500K+</GradientText>
              </div>
              <div className="text-gray-400">Protected Value</div>
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

      {/* Setup Instructions */}
      {!isConfigured && (
        <section className="py-16 px-4 border-t border-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <GradientCard>
              <CardHeader>
                <CardTitle className="text-center">
                  <GradientText>Setup Instructions</GradientText>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-gray-300">
                  <h3 className="font-semibold mb-2">To get started:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      Create a Supabase project at{" "}
                      <a href="https://supabase.com" className="text-blue-400 hover:underline">
                        supabase.com
                      </a>
                    </li>
                    <li>Run the provided SQL script to create the database tables</li>
                    <li>Add your Supabase URL and anon key to your environment variables:</li>
                  </ol>
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg font-mono text-sm">
                    <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
                    <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                  </div>
                </div>
              </CardContent>
            </GradientCard>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-400" />
              <GradientText className="text-lg font-semibold">Wallet Sentinel</GradientText>
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
            <p>&copy; 2024 Wallet Sentinel. Secure wallet monitoring for the Aptos ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
