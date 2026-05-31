import { useEffect, useState } from 'react'
import api, { assetUrl } from '../api/client.js'
import { CATEGORIES, formatINR } from '../constants.js'

const EMPTY = {
  name: '',
  category: 'earrings',
  price: '',
  mrp: '',
  stock: '',
  isViral: false,
  description: '',
  images: [],
}

export default function ProductsManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api
      .get('/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  const openEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      isViral: p.isViral,
      description: p.description || '',
      images: p.images || [],
    })
    setEditingId(p._id)
    setError('')
    setShowForm(true)
  }

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm((f) => ({ ...f, images: [...f.images, data.url] }))
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (idx) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
    }
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload)
      else await api.post('/products', payload)
      setShowForm(false)
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      load()
    } catch {
      setError('Delete failed')
    }
  }

  return (
    <div>
      <div className="admin-head-row">
        <h1 className="admin-h1">Products</h1>
        <button className="admin-btn" onClick={openCreate}>
          + Add product
        </button>
      </div>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Stock</th>
              <th>Viral</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">Loading…</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      className="admin-thumb"
                      src={assetUrl(p.images?.[0])}
                      alt=""
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td>{formatINR(p.mrp)}</td>
                  <td>{p.stock}</td>
                  <td>{p.isViral ? '🔥' : '—'}</td>
                  <td className="admin-actions">
                    <button onClick={() => openEdit(p)}>Edit</button>
                    <button className="danger" onClick={() => remove(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="8" className="muted">
                  No products yet.
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
            <h2>{editingId ? 'Edit product' : 'Add product'}</h2>

            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                required
              />
            </label>

            <div className="admin-form-row">
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) => setField('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.isViral}
                  onChange={(e) => setField('isViral', e.target.checked)}
                />
                Mark as Viral 🔥
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                Price (₹)
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                  required
                />
              </label>
              <label>
                MRP (₹)
                <input
                  type="number"
                  value={form.mrp}
                  onChange={(e) => setField('mrp', e.target.value)}
                  required
                />
              </label>
              <label>
                Stock
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                  required
                />
              </label>
            </div>

            <label>
              Description
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </label>

            <label>
              Images
              <input type="file" accept="image/*" onChange={uploadImage} />
            </label>
            {uploading && <p className="muted">Uploading…</p>}
            <div className="admin-img-list">
              {form.images.map((img, i) => (
                <div className="admin-img" key={i}>
                  <img src={assetUrl(img)} alt="" />
                  <button type="button" onClick={() => removeImage(i)}>
                    ✕
                  </button>
                </div>
              ))}
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
                {editingId ? 'Save changes' : 'Create product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
