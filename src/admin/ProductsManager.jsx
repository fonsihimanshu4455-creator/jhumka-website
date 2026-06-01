import { useEffect, useRef, useState } from 'react'
import api, { assetUrl } from '../api/client.js'
import { CATEGORIES, formatINR } from '../constants.js'
import { IconPlus, IconTrash } from '../components/icons.jsx'
import SmartImage from '../components/SmartImage.jsx'

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
  const [urlInput, setUrlInput] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

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

  const addImage = (url) =>
    setForm((f) => ({ ...f, images: [...f.images, url] }))

  // Upload one or more files (from the file picker or a drop).
  const uploadFiles = async (files) => {
    const list = Array.from(files || []).filter((f) =>
      f.type.startsWith('image/'),
    )
    if (!list.length) return
    setUploading(true)
    setError('')
    try {
      for (const file of list) {
        const fd = new FormData()
        fd.append('image', file)
        const { data } = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        addImage(data.url)
      }
    } catch {
      setError('Image upload failed (is the backend running?)')
    } finally {
      setUploading(false)
    }
  }

  const onFileInput = (e) => {
    uploadFiles(e.target.files)
    e.target.value = ''
  }

  // Add an image by pasting a direct URL.
  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      setError('Please paste a valid image URL (starting with http).')
      return
    }
    addImage(url)
    setUrlInput('')
    setError('')
  }

  // Drag-and-drop: accept dropped files, or an image URL dragged from another tab.
  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files)
      return
    }
    const url = e.dataTransfer.getData('text/uri-list') ||
      e.dataTransfer.getData('text/plain')
    if (url && /^https?:\/\//i.test(url.trim())) addImage(url.trim())
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
                    <SmartImage className="admin-thumb" src={p.images?.[0]} alt="" />
                  </td>
                  <td>{p.name}</td>
                  <td className="cap">{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td>{formatINR(p.mrp)}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.isViral ? (
                      <span className="pill pill--delivered">Viral</span>
                    ) : (
                      '—'
                    )}
                  </td>
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
                Mark as Bestseller
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

            <div className="admin-field">
              <span className="admin-field__label">Images</span>

              {/* Drag-and-drop / click-to-upload zone */}
              <div
                className={`admin-drop ${dragOver ? 'is-over' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <IconPlus />
                <span>
                  <strong>Drag &amp; drop</strong> images here, or{' '}
                  <u>click to upload</u>
                </span>
                <small>You can also drag an image from another browser tab.</small>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={onFileInput}
                />
              </div>

              {/* Paste a direct image URL */}
              <div className="admin-url-row">
                <input
                  type="url"
                  placeholder="…or paste an image URL (https://…)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addUrl()
                    }
                  }}
                />
                <button type="button" className="admin-btn admin-btn--ghost" onClick={addUrl}>
                  Add URL
                </button>
              </div>

              {uploading && <p className="muted">Uploading…</p>}

              <div className="admin-img-list">
                {form.images.map((img, i) => (
                  <div className="admin-img" key={i}>
                    <img src={assetUrl(img)} alt="" />
                    {i === 0 && <span className="admin-img__main">Cover</span>}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      aria-label="Remove image"
                    >
                      <IconTrash width="14" height="14" />
                    </button>
                  </div>
                ))}
              </div>
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
