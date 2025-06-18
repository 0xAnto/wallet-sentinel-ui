"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientText } from "@/components/common/gradient-text"
import { GradientButton } from "@/components/common/gradient-button"
import { signIn, signUp, getCurrentUser } from "@/lib/auth"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [configured, setConfigured] = useState(false)
  const router = useRouter()

  // Check configuration and existing user
  useEffect(() => {
    const checkSetup = async () => {
      const isConfigured = isSupabaseConfigured()
      setConfigured(isConfigured)

      if (!isConfigured) {
        setError("Supabase is not configured. Please check your environment variables.")
        return
      }

      try {
        const user = await getCurrentUser()
        if (user) {
          router.push("/dashboard")
        }
      } catch (error) {
        // User not logged in, stay on auth page
      }
    }

    checkSetup()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!configured) {
      setError("Authentication service is not configured.")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) {
          throw error
        }
        setSuccess("Account created! Check your email to confirm your account, then sign in.")
        setIsSignUp(false)
        setEmail("")
        setPassword("")
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          throw error
        }
        // Successful login - redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An error occurred during authentication")
    } finally {
      setLoading(false)
    }
  }

  if (!configured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center p-4">
        <GradientCard className="w-full max-w-md">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              <GradientText>Setup Required</GradientText>
            </h1>
            <p className="text-gray-400 mb-6">
              Please configure your Supabase environment variables to enable authentication.
            </p>
            <div className="text-left bg-gray-800 p-4 rounded-lg text-sm font-mono">
              <div>NEXT_PUBLIC_SUPABASE_URL=your_url</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key</div>
            </div>
          </div>
        </GradientCard>
      </div>
    )
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
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your email"
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
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              {!isSignUp && <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>}
            </div>

            {error && (
              <Alert className="border-red-700 bg-red-950/50">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-700 bg-green-950/50">
                <AlertDescription className="text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            <GradientButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </GradientButton>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError("")
                setSuccess("")
                setEmail("")
                setPassword("")
              }}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo credentials for testing */}
          
        </div>
      </GradientCard>
    </div>
  )
}
