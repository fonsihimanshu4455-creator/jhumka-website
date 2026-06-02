import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import SmartImage from './SmartImage.jsx'
import { formatINR } from '../constants.js'
import { IconClose, IconPlus, IconMinus, IconTrash, IconWhatsApp } from './icons.jsx'
import api from '../api/client.js'

const WA_FALLBACK = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQty,
    removeFromCart,
    subtotal,
    discount,
    total,
    count,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart()
  const { settings } = useStore()
  const [code, setCode] = useState('')
  const [applying, setApplying] = useState(false)

  const whatsapp = settings.whatsapp || WA_FALLBACK

  const handleApply = async () => {
    setApplying(true)
    const ok = await applyCoupon(code)
    if (ok) setCode('')
    setApplying(false)
  }

  const checkout = async () => {
    if (!items.length) return

    const payload = {
      items: items.map((i) => ({
        product: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      total,
      customer: { name: 'WhatsApp Customer' },
      coupon: coupon?.code || '',
      discount,
    }
    try {
      await api.post('/orders', payload)
    } catch {
      // Don't block checkout if the API is unreachable.
    }

    const lines = items
      .map((i) => `• ${i.name} × ${i.qty} — ${formatINR(i.price * i.qty)}`)
      .join('%0A')
    let text = `Hi ${settings.brandName || 'there'}! I'd like to order:%0A%0A${lines}%0A%0ASubtotal: ${formatINR(
      subtotal,
    )}`
    if (discount > 0)
      text += `%0ACoupon ${coupon.code}: -${formatINR(discount)}`
    text += `%0A%0A*Total: ${formatINR(total)}*`

    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank')
    clearCart()
    setIsOpen(false)
  }

  return (
    <>
      <div
        className={`drawer__overlay ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <aside className={`drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="drawer__head">
          <h3>Your Bag ({count})</h3>
          <button className="drawer__close" onClick={() => setIsOpen(false)} aria-label="Close">
            <IconClose />
          </button>
        </div>

        <div className="drawer__items">
          {items.length === 0 && <p className="drawer__empty">Your bag is empty.</p>}
          {items.map((i) => (
            <div className="drawer__item" key={i.id}>
              <SmartImage src={i.image} alt={i.name} />
              <div className="drawer__item-info">
                <span className="drawer__item-name">{i.name}</span>
                <span className="drawer__item-price">{formatINR(i.price)}</span>
                <div className="qty">
                  <button onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Decrease">
                    <IconMinus />
                  </button>
                  <span>{i.qty}</span>
                  <button onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Increase">
                    <IconPlus />
                  </button>
                </div>
              </div>
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

        {items.length > 0 && (
          <div className="drawer__foot">
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

            <div className="drawer__totals">
              <div className="drawer__line">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="drawer__line drawer__line--save">
                  <span>Discount</span>
                  <span>−{formatINR(discount)}</span>
                </div>
              )}
              <div className="drawer__total">
                <span>Total</span>
                <strong>{formatINR(total)}</strong>
              </div>
            </div>

            <button className="btn btn--whatsapp" onClick={checkout}>
              <IconWhatsApp /> Checkout on WhatsApp
            </button>
            <p className="drawer__note">Shipping &amp; details confirmed on WhatsApp.</p>
          </div>
        )}
      </aside>
    </>
  )
}
