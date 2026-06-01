import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/products', label: 'Products', icon: '🛍️' },
    { to: '/admin/orders', label: 'Orders', icon: '📦' },
  ]

  return (
    <div className="admin">
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`}>
        <div className="admin-sidebar__brand">Jhumka</div>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `admin-nav__link ${isActive ? 'is-active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              <span>{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          ⎋ Logout
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span>Admin Panel</span>
          <a href="/" className="admin-viewsite">
            View store ↗
          </a>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
