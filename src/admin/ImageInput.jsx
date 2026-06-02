import { useRef, useState } from 'react'
import api, { assetUrl } from '../api/client.js'
import { IconPlus, IconTrash } from '../components/icons.jsx'

// Reusable image picker supporting URL paste, drag-and-drop and file upload.
// `multiple={false}` returns a single URL string via onChange; multiple returns
// an array. Used for product images, category image, logo and hero image.
export default function ImageInput({ value, onChange, multiple = false }) {
  const fileRef = useRef(null)
  const [urlInput, setUrlInput] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const images = multiple ? value || [] : value ? [value] : []

  const push = (url) => {
    if (multiple) onChange([...(value || []), url])
    else onChange(url)
  }

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
        push(data.url)
        if (!multiple) break
      }
    } catch {
      setError('Upload failed (is the backend running?)')
    } finally {
      setUploading(false)
    }
  }

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      setError('Paste a valid image URL (starting with http).')
      return
    }
    push(url)
    setUrlInput('')
    setError('')
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) return uploadFiles(e.dataTransfer.files)
    const url =
      e.dataTransfer.getData('text/uri-list') ||
      e.dataTransfer.getData('text/plain')
    if (url && /^https?:\/\//i.test(url.trim())) push(url.trim())
  }

  const removeAt = (idx) => {
    if (multiple) onChange((value || []).filter((_, i) => i !== idx))
    else onChange('')
  }

  return (
    <div className="admin-field">
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
          <strong>Drag &amp; drop</strong> or <u>click to upload</u>
        </span>
        <small>You can also drag an image from another browser tab.</small>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => {
            uploadFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

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
      {error && <p className="coupon__error">{error}</p>}

      {images.length > 0 && (
        <div className="admin-img-list">
          {images.map((img, i) => (
            <div className="admin-img" key={i}>
              <img src={assetUrl(img)} alt="" />
              {multiple && i === 0 && <span className="admin-img__main">Cover</span>}
              <button type="button" onClick={() => removeAt(i)} aria-label="Remove">
                <IconTrash width="14" height="14" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
