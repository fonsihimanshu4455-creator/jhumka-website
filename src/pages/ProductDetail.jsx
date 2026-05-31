import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api, { assetUrl } from '../api/client.js'
import { useCart } from '../context/CartContext.jsx'
import { formatINR, discountPct } from '../constants.js'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    setLoading(true)
    api
      .get(`/products/${id}`)
      .then(({ data }) => live && setProduct(data))
      .catch(() => live && setProduct(null))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [id])

  if (loading) return <div className="container pad">Loading…</div>
  if (!product)
    return (
      <div className="container pad">
        <p>Product not found.</p>
        <Link to="/" className="btn btn--primary">
          Back to shop
        </Link>
      </div>
    )

  const pct = discountPct(product.mrp, product.price)
  const images = product.images?.length ? product.images : ['']
  const soldOut = product.stock <= 0

  return (
    <div className="container pdp">
      <Link to="/" className="pdp__back">
        ← Back
      </Link>
      <div className="pdp__grid">
        <div className="pdp__gallery">
          <img
            className="pdp__main"
            src={assetUrl(images[active])}
            alt={product.name}
          />
          {images.length > 1 && (
            <div className="pdp__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp__thumb ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <img src={assetUrl(img)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          {product.isViral && <span className="card__viral">🔥 Viral</span>}
          <h1 className="pdp__title">{product.name}</h1>
          <div className="pdp__price">
            <span className="card__now">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="card__mrp">{formatINR(product.mrp)}</span>
                <span className="pdp__save">{pct}% OFF</span>
              </>
            )}
          </div>
          <p className="pdp__desc">
            {product.description || 'A trending pick from the Jhumka collection.'}
          </p>
          <p className={`pdp__stock ${soldOut ? 'out' : ''}`}>
            {soldOut ? 'Out of stock' : `In stock (${product.stock} left)`}
          </p>

          {!soldOut && (
            <div className="pdp__buy">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button
                className="btn btn--primary"
                onClick={() => addToCart(product, qty)}
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
