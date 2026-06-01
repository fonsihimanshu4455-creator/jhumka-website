import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { assetUrl } from '../api/client.js'
import { formatINR } from '../constants.js'

export default function CartPage() {
  const { items, updateQty, removeFromCart, total, setIsOpen } = useCart()

  if (!items.length)
    return (
      <div className="container pad cart-empty">
        <h2>Your bag is empty 🌸</h2>
        <p>Looks like you haven't added any sparkle yet.</p>
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
              <img src={assetUrl(i.image)} alt={i.name} />
              <div className="cart-row__info">
                <span className="cart-row__name">{i.name}</span>
                <span className="cart-row__price">{formatINR(i.price)}</span>
              </div>
              <div className="qty">
                <button onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
              </div>
              <strong className="cart-row__sub">
                {formatINR(i.price * i.qty)}
              </strong>
              <button
                className="drawer__remove"
                onClick={() => removeFromCart(i.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-page__summary">
          <h3>Summary</h3>
          <div className="cart-page__line">
            <span>Subtotal</span>
            <strong>{formatINR(total)}</strong>
          </div>
          <div className="cart-page__line muted">
            <span>Shipping</span>
            <span>Calculated on WhatsApp</span>
          </div>
          <button
            className="btn btn--whatsapp"
            onClick={() => setIsOpen(true)}
          >
            Checkout
          </button>
        </aside>
      </div>
    </div>
  )
}
