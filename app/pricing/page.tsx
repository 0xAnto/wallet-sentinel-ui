"use client"

import Link from "next/link"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Sparkles, Shield, Building } from "lucide-react"
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100/60 to-blue-100/60 dark:from-purple-900/40 dark:to-blue-900/40 rounded-full border border-purple-300/30 dark:border-purple-600/30 backdrop-blur-sm">
            <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Simple, Transparent Pricing
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold">
            <GradientText>Choose Your Plan</GradientText>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start free and scale as you grow. Monitor your Aptos wallets with confidence and never miss an important
            balance change.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Free Plan */}
          <GradientCard className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      <GradientText variant="green-emerald">Free</GradientText>
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Forever</p>
                  </div>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300/50 dark:border-green-700/50">
                  Most Popular
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  $0
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">
                    Monitor up to <strong>10 wallets</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">
                    <strong>1 email notification</strong> per wallet daily
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Basic dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">24-hour monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Community support</span>
                </div>
              </div>

              <Link href="/auth" className="block">
                <GradientButton variant="green-emerald" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Get Started Free
                </GradientButton>
              </Link>
            </CardContent>
          </GradientCard>

          {/* Pro Plan */}
          <GradientCard className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30 scale-105 shadow-xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Recommended
              </Badge>
            </div>

            <CardHeader className="pb-4 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    <GradientText variant="purple-blue">Pro</GradientText>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">For serious traders</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  $10
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Advanced monitoring features</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">
                    Monitor up to <strong>50 wallets</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">
                    <strong>5 email notifications</strong> per wallet daily
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Advanced dashboard with analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Hourly monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Priority email support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Custom alert thresholds</span>
                </div>
              </div>

              <GradientButton variant="purple-blue" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Start Pro Trial
              </GradientButton>
            </CardContent>
          </GradientCard>

          {/* Enterprise Plan */}
          <GradientCard className="relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    <GradientText variant="yellow-orange">Enterprise</GradientText>
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">For teams & institutions</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  $25
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Maximum monitoring power</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">
                    Monitor up to <strong>100 wallets</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">
                    <strong>100 notifications</strong> per day
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Real-time monitoring (5-minute intervals)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">SMS & Discord alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">API access & webhooks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm">Dedicated support</span>
                </div>
              </div>

              <GradientButton variant="yellow-orange" className="w-full">
                <Building className="h-4 w-4 mr-2" />
                Contact Sales
              </GradientButton>
            </CardContent>
          </GradientCard>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-5xl mx-auto mt-16">
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                <GradientText>Feature Comparison</GradientText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-200/30 dark:border-purple-700/30">
                      <th className="text-left py-4 px-4 font-medium">Feature</th>
                      <th className="text-center py-4 px-4">
                        <GradientText variant="green-emerald">Free</GradientText>
                      </th>
                      <th className="text-center py-4 px-4">
                        <GradientText variant="purple-blue">Pro</GradientText>
                      </th>
                      <th className="text-center py-4 px-4">
                        <GradientText variant="yellow-orange">Enterprise</GradientText>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-purple-100/30 dark:border-purple-800/30">
                      <td className="py-3 px-4 font-medium">Wallet Monitoring</td>
                      <td className="text-center py-3 px-4">Up to 10</td>
                      <td className="text-center py-3 px-4">Up to 50</td>
                      <td className="text-center py-3 px-4">Up to 100</td>
                    </tr>
                    <tr className="border-b border-purple-100/30 dark:border-purple-800/30">
                      <td className="py-3 px-4 font-medium">Daily Notifications</td>
                      <td className="text-center py-3 px-4">1 per wallet</td>
                      <td className="text-center py-3 px-4">5 per wallet</td>
                      <td className="text-center py-3 px-4">100 total</td>
                    </tr>
                    <tr className="border-b border-purple-100/30 dark:border-purple-800/30">
                      <td className="py-3 px-4 font-medium">Monitoring Frequency</td>
                      <td className="text-center py-3 px-4">24 hours</td>
                      <td className="text-center py-3 px-4">Hourly</td>
                      <td className="text-center py-3 px-4">5 minutes</td>
                    </tr>
                    <tr className="border-b border-purple-100/30 dark:border-purple-800/30">
                      <td className="py-3 px-4 font-medium">SMS & Discord</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-purple-100/30 dark:border-purple-800/30">
                      <td className="py-3 px-4 font-medium">API Access</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Support</td>
                      <td className="text-center py-3 px-4">Community</td>
                      <td className="text-center py-3 px-4">Priority Email</td>
                      <td className="text-center py-3 px-4">Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </GradientCard>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6 mt-16">
          <h2 className="text-3xl font-bold text-center">
            <GradientText>Frequently Asked Questions</GradientText>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="blue-cyan">How does wallet monitoring work?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We check your wallet balances at regular intervals and send you alerts when any wallet drops below
                  your custom threshold. We only monitor balances - never access your private keys.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="green-emerald">Is my wallet data secure?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We only store wallet addresses and alert preferences. We never ask for private keys, seed phrases, or
                  any sensitive information that could access your funds.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="purple-pink">Can I upgrade or downgrade anytime?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the
                  next billing cycle.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="yellow-orange">What payment methods do you accept?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We accept all major credit cards, PayPal, and cryptocurrency payments. Enterprise customers can also
                  pay via bank transfer.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <GradientCard className="backdrop-blur-md bg-gradient-to-br from-purple-50/90 to-blue-50/90 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/30 dark:border-purple-700/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                <GradientText>Ready to secure your wallets?</GradientText>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join thousands of users who trust Wallet Sentinel to monitor their Aptos wallets 24/7.
              </p>
              <Link href="/auth">
                <GradientButton className="px-8 py-3">
                  <Star className="h-4 w-4 mr-2" />
                  Start Free Today
                </GradientButton>
              </Link>
            </CardContent>
          </GradientCard>
        </div>
      </div>
    </div>
  )
}
