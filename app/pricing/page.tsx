"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { PageHeader } from "@/components/common/page-header"

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white">
      <PageHeader
        title="Pricing"
        subtitle="Choose the plan that fits your needs"
        icon={<Crown className="h-6 w-6 text-blue-400" />}
        showBackButton={true}
      />

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <GradientText>Simple, Transparent Pricing</GradientText>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start monitoring your wallets for free. Upgrade when you need more advanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <GradientCard className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  <GradientText variant="green-emerald">Free</GradientText>
                </CardTitle>
                <Badge className="bg-green-900 text-green-200 border-green-700">Current Plan</Badge>
              </div>
              <div className="text-4xl font-bold text-white">
                $0
                <span className="text-lg text-gray-400 font-normal">/month</span>
              </div>
              <p className="text-gray-400">Perfect for getting started with wallet monitoring</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Monitor up to 5 wallets</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Email alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Basic dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>24-hour monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400" />
                  <span>Community support</span>
                </div>
              </div>

              <Link href="/auth">
                <GradientButton variant="green-emerald" className="w-full">
                  Get Started Free
                </GradientButton>
              </Link>
            </CardContent>
          </GradientCard>

          {/* Premium Plan */}
          <GradientCard className="relative border-purple-500/50">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">Coming Soon</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">
                <GradientText variant="purple-pink">Premium</GradientText>
              </CardTitle>
              <div className="text-4xl font-bold text-white">
                $9
                <span className="text-lg text-gray-400 font-normal">/month</span>
              </div>
              <p className="text-gray-400">Advanced features for power users</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Monitor unlimited wallets</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>SMS & Discord alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Real-time monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Custom webhooks</span>
                </div>
              </div>

              <Button className="w-full bg-gray-700 text-gray-400 cursor-not-allowed" disabled>
                <Zap className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </CardContent>
          </GradientCard>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">
            <GradientText>Frequently Asked Questions</GradientText>
          </h2>

          <div className="space-y-4">
            <GradientCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  <GradientText variant="blue-cyan">How does wallet monitoring work?</GradientText>
                </h3>
                <p className="text-gray-400">
                  We check your wallet balances every few minutes and send you an email alert when any wallet drops
                  below your custom threshold. We only monitor balances - we never access your private keys.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  <GradientText variant="green-emerald">Is my wallet data secure?</GradientText>
                </h3>
                <p className="text-gray-400">
                  Yes! We only store your wallet addresses and alert preferences. We never ask for or store private
                  keys, seed phrases, or any sensitive information that could access your funds.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  <GradientText variant="purple-pink">Can I cancel anytime?</GradientText>
                </h3>
                <p className="text-gray-400">
                  The free plan is always free, and when premium launches, you can cancel anytime with no questions
                  asked. Your data will remain accessible during your billing period.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </div>
      </div>
    </div>
  )
}
