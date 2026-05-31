import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { assetUrl } from '../api/client.js'
import { formatINR, discountPct } from '../constants.js'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%23f6dfe7"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="%23c98aa6" text-anchor="middle" dominant-baseline="middle">Jhumka</text></svg>`,
  )

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const pct = discountPct(product.mrp, product.price)
  const img1 = assetUrl(product.images?.[0]) || PLACEHOLDER
  const img2 = assetUrl(product.images?.[1]) || img1
  const soldOut = product.stock !== undefined && product.stock <= 0

  return (
    <div className="card">
      <Link to={`/product/${product._id}`} className="card__media">
        {pct > 0 && <span className="card__badge">{pct}% OFF</span>}
        {soldOut && <span className="card__soldout">Sold out</span>}
        <img className="card__img card__img--front" src={img1} alt={product.name} loading="lazy" />
        <img className="card__img card__img--back" src={img2} alt="" loading="lazy" aria-hidden="true" />
      </Link>
      <div className="card__body">
        {product.isViral && <span className="card__viral">🔥 Viral</span>}
        <Link to={`/product/${product._id}`} className="card__name">
          {product.name}
        </Link>
        <div className="card__price">
          <span className="card__now">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <span className="card__mrp">{formatINR(product.mrp)}</span>
          )}
        </div>
        <button
          className="btn btn--add"
          disabled={soldOut}
          onClick={() => addToCart(product)}
        >
          {soldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}
