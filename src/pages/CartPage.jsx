import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import SmartImage from '../components/SmartImage.jsx'
import { formatINR } from '../constants.js'
import { IconPlus, IconMinus, IconTrash } from '../components/icons.jsx'

export default function CartPage() {
  const {
    items,
    updateQty,
    removeFromCart,
    subtotal,
    discount,
    total,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [applying, setApplying] = useState(false)

  const handleApply = async () => {
    setApplying(true)
    const ok = await applyCoupon(code)
    if (ok) setCode('')
    setApplying(false)
  }

  if (!items.length)
    return (
      <div className="container pad cart-empty">
        <h2>Your bag is empty</h2>
        <p>Discover pieces you’ll love from our latest edit.</p>
        <Link to="/" className="btn btn--primary">
          Start shopping
        </Link>
      </div>
    )

  return (
    <div className="container pad">
      <h1 className="page-title">Your Bag</h1>
      <div className="cart-page">
        <div className="cart-page__list">
          {items.map((i) => (
            <div className="cart-row" key={i.id}>
              <SmartImage src={i.image} alt={i.name} />
              <div className="cart-row__info">
                <span className="cart-row__name">{i.name}</span>
                <span className="cart-row__price">{formatINR(i.price)}</span>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Decrease">
                  <IconMinus />
                </button>
                <span>{i.qty}</span>
                <button onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Increase">
                  <IconPlus />
                </button>
              </div>
              <strong className="cart-row__sub">
                {formatINR(i.price * i.qty)}
              </strong>
              <button
                className="drawer__remove"
                onClick={() => removeFromCart(i.id)}
                aria-label="Remove"
              >
                <IconTrash />
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-page__summary">
          <h3>Order Summary</h3>

          {/* Coupon */}
          {coupon ? (
            <div className="coupon coupon--applied">
              <span>
                Coupon <strong>{coupon.code}</strong> applied
              </span>
              <button onClick={removeCoupon}>Remove</button>
            </div>
          ) : (
            <div className="coupon">
              <input
                placeholder="Coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              />
              <button onClick={handleApply} disabled={applying}>
                {applying ? '…' : 'Apply'}
              </button>
            </div>
          )}
          {couponError && <p className="coupon__error">{couponError}</p>}

          <div className="cart-page__line">
            <span>Subtotal</span>
            <strong>{formatINR(subtotal)}</strong>
          </div>
          {discount > 0 && (
            <div className="cart-page__line cart-page__line--save">
              <span>Discount</span>
              <strong>−{formatINR(discount)}</strong>
            </div>
          )}
          <div className="cart-page__line muted">
            <span>Shipping</span>
            <span>Calculated at delivery</span>
          </div>
          <div className="cart-page__line cart-page__grand">
            <span>Total</span>
            <strong>{formatINR(total)}</strong>
          </div>
          <button
            className="btn btn--primary btn--block"
            onClick={() => navigate('/checkout')}
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  )
}
