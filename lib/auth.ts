import { supabase } from "./supabase"

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    console.log("SignUp response:", { data, error })
    return { data, error }
  } catch (err) {
    console.error("SignUp error:", err)
    return { data: null, error: err }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("SignIn response:", { data, error })
    return { data, error }
  } catch (err) {
    console.error("SignIn error:", err)
    return { data: null, error: err }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    console.log("SignOut response:", { error })
    return { error }
  } catch (err) {
    console.error("SignOut error:", err)
    return { error: err }
  }
}

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    console.log("GetUser response:", { user, error })

    if (error) throw error
    return user
  } catch (err) {
    console.error("GetUser error:", err)
    return null
  }
}

export const getSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    console.log("GetSession response:", { session, error })

    if (error) throw error
    return session
  } catch (err) {
    console.error("GetSession error:", err)
    return null
  }
}
