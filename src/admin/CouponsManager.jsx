import { useEffect, useState } from 'react'
import api from '../api/client.js'
import { formatINR } from '../constants.js'

const EMPTY = {
  code: '',
  type: 'percent',
  value: '',
  minOrder: 0,
  maxDiscount: 0,
  active: true,
  expiresAt: '',
}

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api
      .get('/coupons')
      .then(({ data }) => setCoupons(data))
      .catch(() => setError('Failed to load coupons'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const openCreate = () => {
    setForm(EMPTY)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }
  const openEdit = (c) => {
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder || 0,
      maxDiscount: c.maxDiscount || 0,
      active: c.active,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
    })
    setEditingId(c._id)
    setError('')
    setShowForm(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      code: form.code.toUpperCase().trim(),
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      expiresAt: form.expiresAt || null,
    }
    try {
      if (editingId) await api.put(`/coupons/${editingId}`, payload)
      else await api.post('/coupons', payload)
      setShowForm(false)
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try {
      await api.delete(`/coupons/${id}`)
      load()
    } catch {
      setError('Delete failed')
    }
  }

  const describe = (c) =>
    c.type === 'percent'
      ? `${c.value}% off${c.maxDiscount ? ` (max ${formatINR(c.maxDiscount)})` : ''}`
      : `${formatINR(c.value)} off`

  return (
    <div>
      <div className="admin-head-row">
        <h1 className="admin-h1">Coupons</h1>
        <button className="admin-btn" onClick={openCreate}>
          + Add coupon
        </button>
      </div>
      <p className="admin-hint">
        Customers enter these codes in the cart. Discounts apply automatically to
        the order total.
      </p>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min order</th>
              <th>Status</th>
              <th>Expires</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading…</td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c._id}>
                  <td>
                    <strong>{c.code}</strong>
                  </td>
                  <td>{describe(c)}</td>
                  <td>{c.minOrder ? formatINR(c.minOrder) : '—'}</td>
                  <td>
                    <span
                      className={`pill ${c.active ? 'pill--delivered' : 'pill--cancelled'}`}
                    >
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="admin-actions">
                    <button onClick={() => openEdit(c)}>Edit</button>
                    <button className="danger" onClick={() => remove(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && coupons.length === 0 && (
              <tr>
                <td colSpan="6" className="muted">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="admin-modal" onClick={() => setShowForm(false)}>
          <form
            className="admin-modal__card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <h2>{editingId ? 'Edit coupon' : 'Add coupon'}</h2>
            <label>
              Code
              <input
                value={form.code}
                onChange={(e) => setField('code', e.target.value.toUpperCase())}
                placeholder="WELCOME10"
                required
              />
            </label>
            <div className="admin-form-row">
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(e) => setField('type', e.target.value)}
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat amount (₹)</option>
                </select>
              </label>
              <label>
                Value {form.type === 'percent' ? '(%)' : '(₹)'}
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setField('value', e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Min order (₹)
                <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setField('minOrder', e.target.value)}
                />
              </label>
              {form.type === 'percent' && (
                <label>
                  Max discount (₹, 0 = no cap)
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setField('maxDiscount', e.target.value)}
                  />
                </label>
              )}
            </div>
            <div className="admin-form-row">
              <label>
                Expires on (optional)
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setField('expiresAt', e.target.value)}
                />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setField('active', e.target.checked)}
                />
                Active
              </label>
            </div>

            <div className="admin-modal__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn">
                {editingId ? 'Save changes' : 'Create coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
