import { useEffect, useState } from 'react'
import api from '../api/client.js'
import { formatINR } from '../constants.js'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/orders')])
      .then(([p, o]) => {
        setProducts(p.data)
        setOrders(o.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const revenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + (o.total || 0), 0)
  const pending = orders.filter((o) => o.status === 'Pending').length

  const cards = [
    { label: 'Total Products', value: products.length, icon: '🛍️' },
    { label: 'Total Orders', value: orders.length, icon: '📦' },
    { label: 'Pending Orders', value: pending, icon: '⏳' },
    { label: 'Revenue', value: formatINR(revenue), icon: '💰' },
  ]

  return (
    <div>
      <h1 className="admin-h1">Dashboard</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="admin-cards">
            {cards.map((c) => (
              <div className="admin-card" key={c.label}>
                <span className="admin-card__icon">{c.icon}</span>
                <div>
                  <div className="admin-card__value">{c.value}</div>
                  <div className="admin-card__label">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="admin-h2">Recent Orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-6)}</td>
                    <td>{o.customer?.name || '—'}</td>
                    <td>{formatINR(o.total)}</td>
                    <td>
                      <span className={`pill pill--${o.status?.toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="muted">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
