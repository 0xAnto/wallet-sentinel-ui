import { supabase, isSupabaseConfigured } from "./supabase"

export const signUp = async (email: string, password: string) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Please check your environment variables.")
    }

    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
      },
    })

    console.log("SignUp response:", { data, error })
    return { data, error }
  } catch (err: any) {
    console.error("SignUp error:", err)
    return { data: null, error: { message: err.message || "Authentication service unavailable" } }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Please check your environment variables.")
    }

    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
      options: {
        // Persist session for 30 days
        persistSession: true,
      },
    })

    console.log("SignIn response:", { data, error })
    return { data, error }
  } catch (err: any) {
    console.error("SignIn error:", err)
    return { data: null, error: { message: err.message || "Authentication service unavailable" } }
  }
}

export const signOut = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return { error: null }
    }

    const { error } = await supabase!.auth.signOut()
    console.log("SignOut response:", { error })
    return { error }
  } catch (err: any) {
    console.error("SignOut error:", err)
    return { error: { message: err.message || "Sign out failed" } }
  }
}

export const getCurrentUser = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return null
    }

    const {
      data: { user },
      error,
    } = await supabase!.auth.getUser()
    console.log("GetUser response:", { user, error })

    if (error) throw error
    return user
  } catch (err: any) {
    console.error("GetUser error:", err)
    return null
  }
}

export const getSession = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return null
    }

    const {
      data: { session },
      error,
    } = await supabase!.auth.getSession()
    console.log("GetSession response:", { session, error })

    if (error) throw error
    return session
  } catch (err: any) {
    console.error("GetSession error:", err)
    return null
  }
}

export const checkAuthStatus = async () => {
  try {
    if (!isSupabaseConfigured()) {
      return { user: null, session: null }
    }

    const {
      data: { session },
      error,
    } = await supabase!.auth.getSession()

    if (error) {
      console.error("Session check error:", error)
      return { user: null, session: null }
    }

    if (session?.user) {
      return { user: session.user, session }
    }

    return { user: null, session: null }
  } catch (err: any) {
    console.error("Auth status check error:", err)
    return { user: null, session: null }
  }
}
