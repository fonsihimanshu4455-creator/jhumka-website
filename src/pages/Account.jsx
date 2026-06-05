import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/client.js'
import { formatINR } from '../constants.js'

// Customer-facing account page. Logged out → login / sign-up. Logged in →
// profile details + the customer's own order history.
export default function Account() {
  const { isAuthed, ready } = useAuth()
  if (!ready) return <div className="container pad muted">Loading…</div>
  return (
    <div className="container pad account">
      {isAuthed ? <AccountHome /> : <AuthForms />}
    </div>
  )
}

// ---- Logged-out: login + sign-up ------------------------------------------
function AuthForms() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        const { data } = await signup(form)
        if (!data.session) {
          setInfo('Account created! Please check your email to confirm, then log in.')
          setMode('login')
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login admin-login--page">
      <form className="admin-login__card" onSubmit={submit}>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="admin-login__sub">
          {mode === 'login'
            ? 'Log in to track your orders'
            : 'Sign up to checkout faster and see your orders'}
        </p>

        {error && <div className="admin-alert">{error}</div>}
        {info && <div className="admin-success">{info}</div>}

        {mode === 'signup' && (
          <>
            <label>
              Full name
              <input
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                required
              />
            </label>
            <label>
              Phone (WhatsApp)
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="9198…"
              />
            </label>
          </>
        )}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        <button className="admin-btn" disabled={busy} type="submit">
          {busy
            ? 'Please wait…'
            : mode === 'login'
              ? 'Log in'
              : 'Create account'}
        </button>

        <p className="account__switch">
          {mode === 'login' ? "New here? " : 'Already have an account? '}
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
              setInfo('')
            }}
          >
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  )
}

// ---- Logged-in: profile + my orders ---------------------------------------
function AccountHome() {
  const { profile, logout, refreshProfile, user } = useAuth()
  const [form, setForm] = useState({ fullName: '', phone: '', address: '' })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (profile)
      setForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
      })
  }, [profile])

  useEffect(() => {
    api
      .get('/orders')
      .then(({ data }) => setOrders(data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      await api.put('/profile', form)
      await refreshProfile()
      setMsg('Saved!')
    } catch {
      setMsg('Could not save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="account__grid">
      <section className="account__panel">
        <div className="account__head">
          <h1>My account</h1>
          <button className="admin-btn admin-btn--ghost" onClick={logout}>
            Log out
          </button>
        </div>
        <p className="muted">{user?.email}</p>

        <form onSubmit={save} className="account__form">
          <label>
            Full name
            <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
          </label>
          <label>
            Phone (WhatsApp)
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </label>
          <label>
            Delivery address
            <textarea
              rows="3"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
          </label>
          <button className="admin-btn" disabled={saving} type="submit">
            {saving ? 'Saving…' : 'Save details'}
          </button>
          {msg && <span className="account__msg">{msg}</span>}
        </form>
      </section>

      <section className="account__panel">
        <h2 className="admin-h2">My orders</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="muted">
            No orders yet. <Link to="/" className="linkish">Start shopping →</Link>
          </p>
        ) : (
          <div className="account__orders">
            {orders.map((o) => (
              <div className="account__order" key={o._id}>
                <div className="account__order-top">
                  <strong>#{o._id.slice(-6)}</strong>
                  <span className={`pill pill--${o.status?.toLowerCase()}`}>
                    {o.status}
                  </span>
                </div>
                <div className="account__order-meta">
                  <span>
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString()
                      : ''}
                  </span>
                  <strong>{formatINR(o.total)}</strong>
                </div>
                <ul className="account__order-items">
                  {o.items?.map((it, i) => (
                    <li key={i}>
                      {it.name} × {it.qty}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
