import { useEffect, useState } from 'react'
import api from '../api/client.js'

export default function CustomersManager() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/customers')
      .then(({ data }) => setCustomers(data || []))
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="admin-h1">Customers</h1>
      <p className="admin-hint">
        Everyone who has signed up on your store. Their orders appear under
        Orders.
      </p>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading…</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.fullName || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.address || '—'}</td>
                  <td>
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))
            )}
            {!loading && customers.length === 0 && (
              <tr>
                <td colSpan="4" className="muted">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
