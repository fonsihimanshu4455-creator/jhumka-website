import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const AuthContext = createContext(null)

function authError(message) {
  const err = new Error(message)
  err.response = { data: { message } }
  return err
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  // `ready` flips true once the initial session + profile check finishes, so
  // route guards don't bounce a logged-in user on a page refresh.
  const [ready, setReady] = useState(!isSupabaseConfigured)

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null)
      return null
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile(data || null)
    return data || null
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await loadProfile(data.session?.user?.id)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      loadProfile(s?.user?.id)
    })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  const login = async (email, password) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw authError(error.message)
    setSession(data.session)
    await loadProfile(data.session?.user?.id)
    return data
  }

  const signup = async ({ email, password, fullName, phone }) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '', phone: phone || '' } },
    })
    if (error) throw authError(error.message)
    // If email confirmation is disabled, a session is returned immediately.
    if (data.session) {
      setSession(data.session)
      await loadProfile(data.session.user.id)
    }
    return data
  }

  // Send a one-time code to a phone number (E.164, e.g. +9198…).
  // Requires an SMS provider configured in Supabase (paid).
  const sendOtp = async (phone) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) throw authError(error.message)
    return true
  }

  // Verify the 6-digit code and log the customer in.
  const verifyOtp = async (phone, token) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })
    if (error) throw authError(error.message)
    setSession(data.session)
    await loadProfile(data.session?.user?.id)
    return data
  }

  // FREE alternative: send a one-time code to an email (no SMS provider needed).
  const sendEmailOtp = async (email) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (error) throw authError(error.message)
    return true
  }

  const verifyEmailOtp = async (email, token) => {
    if (!supabase) throw authError('Store is not connected yet.')
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: token.trim(),
      type: 'email',
    })
    if (error) throw authError(error.message)
    setSession(data.session)
    await loadProfile(data.session?.user?.id)
    return data
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  const refreshProfile = () => loadProfile(session?.user?.id)

  const value = {
    user: session?.user || null,
    profile,
    ready,
    isAuthed: !!session,
    isAdmin: profile?.role === 'admin',
    login,
    signup,
    sendOtp,
    verifyOtp,
    sendEmailOtp,
    verifyEmailOtp,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
