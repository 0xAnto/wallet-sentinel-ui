import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      wallets: {
        Row: {
          id: string
          user_id: string
          address: string
          threshold: number
          nickname: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address: string
          threshold: number
          nickname?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address?: string
          threshold?: number
          nickname?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          wallet_id: string
          wallet_address: string
          balance: number
          threshold: number
          sent_at: string
          email_sent: boolean
        }
        Insert: {
          id?: string
          user_id: string
          wallet_id: string
          wallet_address: string
          balance: number
          threshold: number
          sent_at?: string
          email_sent?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          wallet_id?: string
          wallet_address?: string
          balance?: number
          threshold?: number
          sent_at?: string
          email_sent?: boolean
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean
          notification_frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean
          notification_frequency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean
          notification_frequency?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
