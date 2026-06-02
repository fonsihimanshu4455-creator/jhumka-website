import { useEffect, useState } from 'react'
import api from '../api/client.js'
import ImageInput from './ImageInput.jsx'

export default function SettingsManager() {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => setForm(data))
      .catch(() => setError('Failed to load settings (is the backend running?)'))
      .finally(() => setLoading(false))
  }, [])

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    setError('')
    try {
      const { data } = await api.put('/settings', form)
      setForm(data)
      setMsg('Settings saved. Refresh the store to see changes.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading…</p>
  if (!form)
    return <div className="admin-alert">{error || 'Settings unavailable.'}</div>

  return (
    <div>
      <h1 className="admin-h1">Store Settings</h1>
      {error && <div className="admin-alert">{error}</div>}
      {msg && <div className="admin-success">{msg}</div>}

      <form className="admin-panels" onSubmit={save}>
        {/* Branding */}
        <section className="admin-panel">
          <h2 className="admin-h2">Branding</h2>
          <div className="admin-form-row">
            <label>
              Brand name
              <input
                value={form.brandName || ''}
                onChange={(e) => setField('brandName', e.target.value)}
              />
            </label>
            <label>
              Tagline
              <input
                value={form.tagline || ''}
                onChange={(e) => setField('tagline', e.target.value)}
              />
            </label>
          </div>
          <label>
            WhatsApp number (for checkout, digits only e.g. 9198…)
            <input
              value={form.whatsapp || ''}
              onChange={(e) => setField('whatsapp', e.target.value)}
              placeholder="919999999999"
            />
          </label>
          <span className="admin-field__label">
            Logo (optional — replaces the text logo)
          </span>
          <ImageInput value={form.logo} onChange={(v) => setField('logo', v)} />
        </section>

        {/* Hero */}
        <section className="admin-panel">
          <h2 className="admin-h2">Homepage hero</h2>
          <label>
            Hero title
            <input
              value={form.heroTitle || ''}
              onChange={(e) => setField('heroTitle', e.target.value)}
            />
          </label>
          <label>
            Hero subtitle / eyebrow
            <input
              value={form.heroSubtitle || ''}
              onChange={(e) => setField('heroSubtitle', e.target.value)}
            />
          </label>
          <span className="admin-field__label">Hero background image</span>
          <ImageInput
            value={form.heroImage}
            onChange={(v) => setField('heroImage', v)}
          />
        </section>

        {/* Offer strip */}
        <section className="admin-panel">
          <h2 className="admin-h2">Promo offer strip</h2>
          <label className="admin-check admin-check--inline">
            <input
              type="checkbox"
              checked={!!form.offerActive}
              onChange={(e) => setField('offerActive', e.target.checked)}
            />
            Show offer strip on homepage
          </label>
          <label>
            Offer text
            <input
              value={form.offerText || ''}
              onChange={(e) => setField('offerText', e.target.value)}
              placeholder="Use code WELCOME10 for 10% off"
            />
          </label>
        </section>

        {/* Announcements */}
        <section className="admin-panel">
          <h2 className="admin-h2">Announcement bar</h2>
          <p className="admin-hint">One message per line. These scroll at the very top.</p>
          <textarea
            rows="4"
            value={(form.announcements || []).join('\n')}
            onChange={(e) =>
              setField(
                'announcements',
                e.target.value.split('\n').map((s) => s.trimStart()),
              )
            }
          />
        </section>

        <div className="admin-save-bar">
          <button className="admin-btn" disabled={saving} type="submit">
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
