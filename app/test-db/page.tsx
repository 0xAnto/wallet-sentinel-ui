"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GradientCard } from "@/components/common/gradient-card"
import { GradientText } from "@/components/common/gradient-text"
import { supabase } from "@/lib/supabase"

export default function TestDB() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Test basic connection
      const { data, error } = await supabase.from("wallets").select("count", { count: "exact", head: true })

      if (error) {
        setResult(`❌ Error: ${error.message}`)
      } else {
        setResult(`✅ Database connected! Wallets table has ${data?.length || 0} records`)
      }
    } catch (err: any) {
      setResult(`❌ Connection failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAuth = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setResult(`✅ User authenticated: ${user.email}`)
      } else {
        setResult(`ℹ️ No user logged in`)
      }
    } catch (err: any) {
      setResult(`❌ Auth test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testTableStructure = async () => {
    setLoading(true)
    try {
      // Test if we can query the table structure
      const { data, error } = await supabase.rpc("get_table_info", { table_name: "wallets" }).single()

      if (error) {
        // Fallback: try to select from wallets with limit 0 to test structure
        const { error: selectError } = await supabase.from("wallets").select("*").limit(0)

        if (selectError) {
          setResult(`❌ Table structure test failed: ${selectError.message}`)
        } else {
          setResult(`✅ Wallets table structure is accessible`)
        }
      } else {
        setResult(`✅ Table info retrieved successfully`)
      }
    } catch (err: any) {
      setResult(`❌ Structure test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black text-white p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <GradientCard>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
              <GradientText>Database Connection Test</GradientText>
            </h1>

            <div className="space-y-4">
              <Button onClick={testConnection} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Database Connection"}
              </Button>

              <Button onClick={testAuth} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Authentication"}
              </Button>

              <Button onClick={testTableStructure} disabled={loading} className="w-full">
                {loading ? "Testing..." : "Test Table Structure"}
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}
          </div>
        </GradientCard>
      </div>
    </div>
  )
}
