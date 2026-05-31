import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL })

// Attach admin JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jhumka_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Build an absolute URL for uploaded images returned by the API.
export const assetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:')) return path
  const origin = baseURL.replace(/\/api\/?$/, '')
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

export default api
