import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Admin area guard. Only users whose profile role is 'admin' get in.
export default function ProtectedRoute({ children }) {
  const { isAuthed, isAdmin, ready } = useAuth()
  if (!ready) return <div className="container pad muted">Loading…</div>
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  // Signed in but not an admin (e.g. a customer) — send to the storefront.
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
