import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const AuthContext = createContext(null)

function authError(message) {
  const err = new Error(message)
  err.response = { data: { message } }
  return err
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // `ready` flips true once we've checked for an existing session, so guards
  // don't bounce a logged-in admin to the login screen on a page refresh.
  const [ready, setReady] = useState(!isSupabaseConfigured)

  useEffect(() => {
    // Not configured: `ready` already starts true, nothing to load.
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw authError(error.message)
    setSession(data.session)
    return data
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthed: !!session, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
