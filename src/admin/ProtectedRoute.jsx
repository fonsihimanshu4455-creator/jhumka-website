import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthed, ready } = useAuth()
  // Wait until the session check finishes to avoid flashing the login screen.
  if (!ready) return <div className="container pad muted">Loading…</div>
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  return children
}
