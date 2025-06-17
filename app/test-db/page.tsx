"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientText } from "@/components/common/gradient-text"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function TestDatabase() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDatabase = async () => {
    setLoading(true)
    setResults([])

    try {
      addResult("🔍 Testing database connection...")

      // Test 1: Check if tables exist
      const { data: tables, error: tablesError } = await supabase.from("wallets").select("id").limit(1)

      if (tablesError) {
        addResult(`❌ Tables check failed: ${tablesError.message}`)
        return
      }

      addResult("✅ Database tables accessible")

      // Test 2: Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        addResult(`✅ User authenticated: ${user.email}`)

        // Test 3: Try to insert and delete a test wallet
        try {
          const { data: wallet, error: insertError } = await supabase
            .from("wallets")
            .insert({
              user_id: user.id,
              address: "0xtest" + Date.now(),
              threshold: 10.0,
              nickname: "Test Wallet",
            })
            .select()
            .single()

          if (insertError) {
            addResult(`❌ Insert test failed: ${insertError.message}`)
          } else {
            addResult("✅ Wallet insert successful")

            // Clean up
            await supabase.from("wallets").delete().eq("id", wallet.id)
            addResult("✅ Test cleanup successful")
          }
        } catch (error: any) {
          addResult(`❌ Wallet operations failed: ${error.message}`)
        }
      } else {
        addResult("⚠️ No user authenticated - please sign in first")
      }

      addResult("🎉 Database test completed!")
    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <GradientCard>
          <CardHeader>
            <CardTitle>
              <GradientText>Database Test</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testDatabase} disabled={loading} className="w-full">
              {loading ? "Testing..." : "Run Database Test"}
            </Button>

            {results.length > 0 && (
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Test Results:</h3>
                <div className="space-y-1 text-sm font-mono">
                  {results.map((result, index) => (
                    <div key={index} className="text-gray-300">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </GradientCard>
      </div>
    </div>
  )
}
