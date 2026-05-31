import { Fragment, useEffect, useState } from 'react'
import api from '../api/client.js'
import { formatINR } from '../constants.js'

const STATUSES = ['Pending', 'Dispatched', 'Delivered', 'Cancelled']

export default function OrdersManager() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/orders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status })
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o)),
      )
    } catch {
      alert('Could not update status')
    }
  }

  return (
    <div>
      <h1 className="admin-h1">Orders</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading…</td>
              </tr>
            ) : (
              orders.map((o) => (
                <Fragment key={o._id}>
                  <tr
                    className="admin-row-click"
                    onClick={() =>
                      setExpanded(expanded === o._id ? null : o._id)
                    }
                  >
                    <td>#{o._id.slice(-6)}</td>
                    <td>
                      {o.customer?.name || '—'}
                      <br />
                      <span className="muted">{o.customer?.phone}</span>
                    </td>
                    <td>{o.items?.length}</td>
                    <td>{formatINR(o.total)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className={`status-select status--${o.status?.toLowerCase()}`}
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                  {expanded === o._id && (
                    <tr className="admin-detail-row">
                      <td colSpan="6">
                        <div className="order-detail">
                          <div>
                            <strong>Customer</strong>
                            <p>
                              {o.customer?.name} <br />
                              {o.customer?.phone} <br />
                              {o.customer?.address}
                            </p>
                          </div>
                          <div>
                            <strong>Items</strong>
                            <ul>
                              {o.items?.map((it, i) => (
                                <li key={i}>
                                  {it.name} × {it.qty} —{' '}
                                  {formatINR(it.price * it.qty)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
