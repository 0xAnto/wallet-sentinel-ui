import { createClient } from "@supabase/supabase-js"

// Add fallback values and validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Some features may not work.")
}

// Create client with error handling and session persistence
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // Set session to persist for 30 days
          storageKey: "wallet-sentinel-auth",
        },
      })
    : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null && !!supabaseUrl && !!supabaseAnonKey
}
