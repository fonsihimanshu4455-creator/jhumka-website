import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container pad cart-empty">
      <h2>404 — Page not found</h2>
      <p>This page wandered off looking for sparkle.</p>
      <Link to="/" className="btn btn--primary">
        Go home
      </Link>
    </div>
  )
}
