import { createContext, useContext, useState } from 'react'
import api from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem('jhumka_admin_token') || '',
  )

  const login = async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password })
    localStorage.setItem('jhumka_admin_token', data.token)
    setToken(data.token)
    return data
  }

  const logout = () => {
    localStorage.removeItem('jhumka_admin_token')
    setToken('')
  }

  return (
    <AuthContext.Provider value={{ token, isAuthed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
