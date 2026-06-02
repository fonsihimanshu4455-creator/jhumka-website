import { useEffect, useState } from 'react'
import api from '../api/client.js'
import SmartImage from '../components/SmartImage.jsx'
import ImageInput from './ImageInput.jsx'

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const EMPTY = { name: '', slug: '', image: '', order: 0 }

export default function CategoriesManager() {
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api
      .get('/categories')
      .then(({ data }) => setCats(data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const openCreate = () => {
    setForm({ ...EMPTY, order: cats.length + 1 })
    setEditingId(null)
    setError('')
    setShowForm(true)
  }
  const openEdit = (c) => {
    setForm({ name: c.name, slug: c.slug, image: c.image || '', order: c.order || 0 })
    setEditingId(c._id)
    setError('')
    setShowForm(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      order: Number(form.order) || 0,
    }
    try {
      if (editingId) await api.put(`/categories/${editingId}`, payload)
      else await api.post('/categories', payload)
      setShowForm(false)
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return
    try {
      await api.delete(`/categories/${id}`)
      load()
    } catch {
      setError('Delete failed')
    }
  }

  return (
    <div>
      <div className="admin-head-row">
        <h1 className="admin-h1">Categories</h1>
        <button className="admin-btn" onClick={openCreate}>
          + Add category
        </button>
      </div>
      <p className="admin-hint">
        Categories appear in the header, the “Shop by category” strip and product
        filters. Add a photo for the round category tile.
      </p>

      {error && <div className="admin-alert">{error}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading…</td>
              </tr>
            ) : (
              cats.map((c) => (
                <tr key={c._id}>
                  <td>
                    <SmartImage className="admin-thumb" src={c.image} alt="" />
                  </td>
                  <td>{c.name}</td>
                  <td className="muted">{c.slug}</td>
                  <td>{c.order}</td>
                  <td className="admin-actions">
                    <button onClick={() => openEdit(c)}>Edit</button>
                    <button className="danger" onClick={() => remove(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && cats.length === 0 && (
              <tr>
                <td colSpan="5" className="muted">
                  No categories yet.
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
            <h2>{editingId ? 'Edit category' : 'Add category'}</h2>
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
                Slug (URL)
                <input
                  value={form.slug}
                  placeholder={slugify(form.name) || 'auto'}
                  onChange={(e) => setField('slug', slugify(e.target.value))}
                />
              </label>
              <label>
                Display order
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setField('order', e.target.value)}
                />
              </label>
            </div>
            <span className="admin-field__label">Category image</span>
            <ImageInput value={form.image} onChange={(v) => setField('image', v)} />

            <div className="admin-modal__actions">
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn">
                {editingId ? 'Save changes' : 'Create category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
