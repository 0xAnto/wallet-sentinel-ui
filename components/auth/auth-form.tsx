"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientText } from "@/components/common/gradient-text"
import { GradientButton } from "@/components/common/gradient-button"
import { signIn, signUp } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setError("Check your email for the confirmation link!")
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        router.push("/dashboard")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center p-4">
      <GradientCard className="w-full max-w-md">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <GradientText>Wallet Sentinel</GradientText>
            </h1>
            <p className="text-gray-400">{isSignUp ? "Create your account" : "Sign in to your account"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700"
                required
              />
            </div>

            {error && (
              <Alert className="border-red-700 bg-red-950/50">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <GradientButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </GradientCard>
    </div>
  )
}
