import { useCart } from '../context/CartContext.jsx'
import { assetUrl } from '../api/client.js'
import { formatINR, WHATSAPP_NUMBER } from '../constants.js'
import api from '../api/client.js'

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQty,
    removeFromCart,
    total,
    count,
    clearCart,
  } = useCart()

  const checkout = async () => {
    if (!items.length) return

    // Best-effort: record the order in the backend before WhatsApp handoff.
    const payload = {
      items: items.map((i) => ({
        product: i.id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      total,
      customer: { name: 'WhatsApp Customer' },
    }
    try {
      await api.post('/orders', payload)
    } catch {
      // Don't block checkout if the API is unreachable.
    }

    const lines = items
      .map((i) => `• ${i.name} × ${i.qty} — ${formatINR(i.price * i.qty)}`)
      .join('%0A')
    const text =
      `Hi Jhumka! 🛍️ I'd like to order:%0A%0A${lines}%0A%0A*Total: ${formatINR(
        total,
      )}*`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
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
          <button className="drawer__close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        <div className="drawer__items">
          {items.length === 0 && (
            <p className="drawer__empty">Your bag is empty 🌸</p>
          )}
          {items.map((i) => (
            <div className="drawer__item" key={i.id}>
              <img src={assetUrl(i.image)} alt={i.name} />
              <div className="drawer__item-info">
                <span className="drawer__item-name">{i.name}</span>
                <span className="drawer__item-price">{formatINR(i.price)}</span>
                <div className="qty">
                  <button onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
                </div>
              </div>
              <button
                className="drawer__remove"
                onClick={() => removeFromCart(i.id)}
                aria-label="Remove"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="drawer__foot">
            <div className="drawer__total">
              <span>Total</span>
              <strong>{formatINR(total)}</strong>
            </div>
            <button className="btn btn--whatsapp" onClick={checkout}>
              <span>🟢</span> Checkout on WhatsApp
            </button>
            <p className="drawer__note">You'll confirm details on WhatsApp.</p>
          </div>
        )}
      </aside>
    </>
  )
}
