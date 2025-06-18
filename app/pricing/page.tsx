"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Star, Sparkles, Rocket } from 'lucide-react'
import { GradientText } from "@/components/common/gradient-text"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientButton } from "@/components/common/gradient-button"
import { PageHeader } from "@/components/common/page-header"
import { HeroSection } from "@/components/common/hero-section"

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-white dark:from-gray-950 dark:via-purple-950 dark:to-black text-gray-900 dark:text-white">
      <PageHeader
        title="Pricing"
        subtitle="Choose the plan that fits your needs"
        icon={<Crown className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        showBackButton={true}
      />

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Hero Section */}
        <HeroSection
          title="Simple, Transparent Pricing"
          subtitle="Start Free, Scale as You Grow"
          description="Monitor your wallets for free with our starter plan. Upgrade to premium when you need advanced features and unlimited monitoring."
          icon={<Crown className="h-6 w-6 text-white" />}
          stats={{
            value: "Free",
            label: "Forever Plan",
            sublabel: "No credit card required",
          }}
        />

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <GradientCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
            <div className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-2xl">
                      <GradientText variant="green-emerald">Starter</GradientText>
                    </CardTitle>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700">
                    Most Popular
                  </Badge>
                </div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mt-4">
                  Free
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/forever</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Perfect for getting started with wallet monitoring</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Monitor up to 5 wallets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Email alerts (hourly & daily)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Multiple notification emails</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Basic dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>24-hour monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Community support</span>
                  </div>
                </div>

                <Link href="/auth">
                  <GradientButton variant="green-emerald" className="w-full text-lg py-3">
                    <Star className="h-4 w-4 mr-2" />
                    Get Started Free
                  </GradientButton>
                </Link>
              </CardContent>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl"></div>
          </GradientCard>

          {/* Premium Plan */}
          <GradientCard className="relative overflow-hidden border-purple-300 dark:border-purple-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <div className="relative">
              <CardHeader className="pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-2xl">
                    <GradientText variant="purple-pink">Premium</GradientText>
                  </CardTitle>
                </div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mt-4">
                  $9
                  <span className="text-lg text-gray-600 dark:text-gray-400 font-normal">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Advanced features for power users and teams</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Monitor unlimited wallets</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>SMS & Discord alerts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Real-time monitoring (1-minute intervals)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Advanced analytics & insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Portfolio tracking & history</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>API access & webhooks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span>Priority support</span>
                  </div>
                </div>

                <Button className="w-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed text-lg py-3" disabled>
                  <Zap className="h-4 w-4 mr-2" />
                  Coming Soon
                </Button>
              </CardContent>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl"></div>
          </GradientCard>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto">
          <GradientCard>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                <GradientText>Feature Comparison</GradientText>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">
                        <GradientText variant="green-emerald">Starter</GradientText>
                      </th>
                      <th className="text-center py-3 px-4">
                        <GradientText variant="purple-pink">Premium</GradientText>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">Wallet Monitoring</td>
                      <td className="text-center py-3 px-4">Up to 5</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">Email Alerts</td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">SMS & Discord</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">Monitoring Frequency</td>
                      <td className="text-center py-3 px-4">Hourly</td>
                      <td className="text-center py-3 px-4">Real-time</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">API Access</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Support</td>
                      <td className="text-center py-3 px-4">Community</td>
                      <td className="text-center py-3 px-4">Priority</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="blue-cyan">How does wallet monitoring work?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We check your wallet balances every hour (or in real-time for premium users) and send you an email alert when any wallet drops
                  below your custom threshold. We only monitor balances - we never access your private keys or funds.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="green-emerald">Is my wallet data secure?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We only store your wallet addresses and alert preferences. We never ask for or store private
                  keys, seed phrases, or any sensitive information that could access your funds. Your data is encrypted and secure.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="purple-pink">Can I cancel anytime?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The starter plan is always free with no commitments. When premium launches, you can cancel anytime with no questions
                  asked. Your data will remain accessible during your billing period.
                </p>
              </CardContent>
            </GradientCard>

            <GradientCard>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">
                  <GradientText variant="yellow-orange">What happens when premium launches?</GradientText>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Current free users will keep all their existing features. Premium will add advanced capabilities like unlimited wallets,
                  real-time monitoring, SMS alerts, and API access. You can upgrade whenever you're ready.
                </p>
              </CardContent>
            </GradientCard>
          </div>
        </div>
      </div>
    </div>
  )
}
