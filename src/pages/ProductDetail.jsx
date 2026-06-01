import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client.js'
import { useCart } from '../context/CartContext.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { formatINR, discountPct } from '../constants.js'
import {
  IconArrowLeft,
  IconPlus,
  IconMinus,
  IconBag,
  IconTruck,
  IconShield,
} from '../components/icons.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let live = true
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (!live) return
        setProduct(data)
        setActive(0)
      })
      .catch(() => live && setProduct(null))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [id])

  if (loading) return <div className="container pad muted">Loading…</div>
  if (!product)
    return (
      <div className="container pad cart-empty">
        <h2>Product not found</h2>
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
        <IconArrowLeft width="18" height="18" /> Back to shop
      </Link>
      <div className="pdp__grid">
        <div className="pdp__gallery">
          <div className="pdp__main-wrap">
            <SmartImage
              src={images[active]}
              alt={product.name}
              className="pdp__main"
            />
          </div>
          {images.length > 1 && (
            <div className="pdp__thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp__thumb ${i === active ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <SmartImage src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          {product.isViral && <span className="pdp__eyebrow">Bestseller</span>}
          <h1 className="pdp__title">{product.name}</h1>
          <div className="pdp__price">
            <span className="card__now">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="card__mrp">{formatINR(product.mrp)}</span>
                <span className="pdp__save">{pct}% off</span>
              </>
            )}
          </div>
          <p className="pdp__desc">
            {product.description ||
              'A timeless piece from the Jhumka collection, crafted to elevate every occasion.'}
          </p>
          <p className={`pdp__stock ${soldOut ? 'out' : ''}`}>
            {soldOut ? 'Out of stock' : `In stock · ${product.stock} available`}
          </p>

          {!soldOut && (
            <div className="pdp__buy">
              <div className="qty qty--lg">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  <IconMinus />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                  <IconPlus />
                </button>
              </div>
              <button
                className="btn btn--primary btn--block"
                onClick={() => addToCart(product, qty)}
              >
                <IconBag width="18" height="18" /> Add to bag
              </button>
            </div>
          )}

          <div className="pdp__perks">
            <div className="pdp__perk">
              <IconTruck /> <span>Free shipping over ₹999</span>
            </div>
            <div className="pdp__perk">
              <IconShield /> <span>6-month warranty included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
