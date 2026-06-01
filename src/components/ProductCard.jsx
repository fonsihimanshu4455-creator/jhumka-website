import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import SmartImage from './SmartImage.jsx'
import { formatINR, discountPct } from '../constants.js'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const pct = discountPct(product.mrp, product.price)
  const img1 = product.images?.[0]
  const img2 = product.images?.[1] || img1
  const soldOut = product.stock !== undefined && product.stock <= 0

  return (
    <article className="card">
      <Link to={`/product/${product._id}`} className="card__media">
        {pct > 0 && <span className="card__badge">-{pct}%</span>}
        {product.isViral && <span className="card__tag">Bestseller</span>}
        {soldOut && <span className="card__soldout">Sold out</span>}
        <SmartImage src={img1} alt={product.name} className="card__img card__img--front" />
        <SmartImage src={img2} alt="" className="card__img card__img--back" aria-hidden="true" />
        {!soldOut && (
          <button
            className="card__quick"
            onClick={(e) => {
              e.preventDefault()
              addToCart(product)
            }}
          >
            Add to bag
          </button>
        )}
      </Link>
      <div className="card__body">
        <Link to={`/product/${product._id}`} className="card__name">
          {product.name}
        </Link>
        <div className="card__price">
          <span className="card__now">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <span className="card__mrp">{formatINR(product.mrp)}</span>
          )}
        </div>
      </div>
    </article>
  )
}
