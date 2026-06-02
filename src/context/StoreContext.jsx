import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client.js'
import { DEMO_CATEGORIES, DEMO_SETTINGS } from '../data/demoProducts.js'

const StoreContext = createContext(null)

// Loads store-wide settings (branding, announcements, hero, offer) and the
// category list from the backend, with demo fallbacks so the site works even
// before a backend is connected.
export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(DEMO_SETTINGS)
  const [categories, setCategories] = useState(DEMO_CATEGORIES)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    Promise.allSettled([api.get('/settings'), api.get('/categories')]).then(
      ([s, c]) => {
        if (!active) return
        if (s.status === 'fulfilled' && s.value.data) {
          setSettings({ ...DEMO_SETTINGS, ...s.value.data })
        }
        if (
          c.status === 'fulfilled' &&
          Array.isArray(c.value.data) &&
          c.value.data.length
        ) {
          setCategories(c.value.data)
        }
        setReady(true)
      },
    )
    return () => {
      active = false
    }
  }, [])

  return (
    <StoreContext.Provider value={{ settings, categories, ready }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
