import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/client.js'
import { formatINR } from '../constants.js'
import { IconWhatsApp, IconShield } from '../components/icons.jsx'

const WA_FALLBACK = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

// Loads the Razorpay checkout script once.
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function Checkout() {
  const { items, subtotal, discount, total, coupon, clearCart } = useCart()
  const { settings } = useStore()
  const { profile, user } = useAuth()

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null) // null | 'paid' | 'whatsapp'

  useEffect(() => {
    if (profile)
      setForm({
        name: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
      })
  }, [profile])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const orderItems = items.map((i) => ({
    product: i.id,
    name: i.name,
    price: i.price,
    qty: i.qty,
  }))

  const validate = () => {
    if (!items.length) {
      setError('Your bag is empty.')
      return false
    }
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please enter your name and phone number.')
      return false
    }
    setError('')
    return true
  }

  // ---- Pay online with Razorpay ----
  const payOnline = async () => {
    if (!validate()) return
    setBusy(true)
    setError('')
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Could not load the payment window. Check your internet.')

      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok) throw new Error(order.error || 'Could not start payment.')

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: settings.brandName || 'Jhumka',
        description: `Order — ${items.length} item(s)`,
        order_id: order.orderId,
        prefill: {
          name: form.name,
          contact: form.phone,
          email: user?.email || '',
        },
        notes: { address: form.address },
        theme: { color: '#7a2e4a' },
        handler: async (response) => {
          try {
            const vRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const v = await vRes.json()
            if (!v.valid) {
              setError('Payment could not be verified. If money was deducted, contact us.')
              setBusy(false)
              return
            }
            await api.post('/orders', {
              items: orderItems,
              total,
              customer: {
                name: form.name,
                phone: form.phone,
                address: form.address,
                email: user?.email || '',
              },
              status: 'Paid',
              payment: {
                provider: 'razorpay',
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              },
              coupon: coupon?.code || '',
              discount,
            })
            clearCart()
            setDone('paid')
          } catch {
            setError('Payment succeeded but saving the order failed. Please contact us with your payment id.')
            setBusy(false)
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      })
      rzp.on('payment.failed', () => {
        setError('Payment failed or was cancelled. Please try again.')
        setBusy(false)
      })
      rzp.open()
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      setBusy(false)
    }
  }

  // ---- Order on WhatsApp (no online payment) ----
  const orderOnWhatsApp = async () => {
    if (!validate()) return
    setBusy(true)
    try {
      await api.post('/orders', {
        items: orderItems,
        total,
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          email: user?.email || '',
        },
        status: 'Pending',
        coupon: coupon?.code || '',
        discount,
      })
    } catch {
      // don't block the WhatsApp handoff
    }
    const whatsapp = settings.whatsapp || WA_FALLBACK
    const lines = items
      .map((i) => `• ${i.name} × ${i.qty} — ${formatINR(i.price * i.qty)}`)
      .join('%0A')
    let text = `Hi ${settings.brandName || 'there'}! I'd like to order:%0A%0A${lines}%0A%0AName: ${form.name}%0APhone: ${form.phone}`
    if (form.address) text += `%0AAddress: ${form.address}`
    text += `%0A%0ASubtotal: ${formatINR(subtotal)}`
    if (discount > 0) text += `%0ACoupon ${coupon.code}: -${formatINR(discount)}`
    text += `%0A%0A*Total: ${formatINR(total)}*`
    window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank')
    clearCart()
    setDone('whatsapp')
  }

  if (done) {
    return (
      <div className="container pad checkout-done">
        <div className="checkout-done__card">
          <h1>{done === 'paid' ? 'Payment successful 🎉' : 'Order sent on WhatsApp ✅'}</h1>
          <p className="muted">
            {done === 'paid'
              ? 'Thank you! Your order is confirmed. We’ll be in touch about delivery.'
              : 'We’ve opened WhatsApp with your order details. Send the message to confirm.'}
          </p>
          <Link to="/" className="btn btn--primary">Continue shopping</Link>
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="container pad cart-empty">
        <h2>Your bag is empty</h2>
        <Link to="/" className="btn btn--primary">Back to shop</Link>
      </div>
    )
  }

  return (
    <div className="container pad checkout">
      <h1 className="checkout__title">Checkout</h1>
      <div className="checkout__grid">
        {/* Details */}
        <section className="checkout__panel">
          <h2 className="admin-h2">Your details</h2>
          {error && <div className="admin-alert">{error}</div>}
          <div className="checkout__form">
            <label>
              Full name *
              <input value={form.name} onChange={(e) => set('name', e.target.value)} />
            </label>
            <label>
              Phone (WhatsApp) *
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="9198…" />
            </label>
            <label>
              Delivery address
              <textarea rows="3" value={form.address} onChange={(e) => set('address', e.target.value)} />
            </label>
          </div>

          <button className="btn btn--primary btn--block" disabled={busy} onClick={payOnline}>
            {busy ? 'Please wait…' : `Pay ${formatINR(total)} online`}
          </button>
          <div className="checkout__or">or</div>
          <button className="btn btn--whatsapp btn--block" disabled={busy} onClick={orderOnWhatsApp}>
            <IconWhatsApp /> Order on WhatsApp
          </button>
          <p className="checkout__secure">
            <IconShield width="16" height="16" /> Secure payment via Razorpay (UPI, cards, netbanking)
          </p>
        </section>

        {/* Summary */}
        <section className="checkout__panel checkout__summary">
          <h2 className="admin-h2">Order summary</h2>
          <div className="checkout__items">
            {items.map((i) => (
              <div className="checkout__item" key={i.id}>
                <span>{i.name} × {i.qty}</span>
                <span>{formatINR(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="checkout__line">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="checkout__line checkout__line--save">
              <span>Discount {coupon ? `(${coupon.code})` : ''}</span>
              <span>−{formatINR(discount)}</span>
            </div>
          )}
          <div className="checkout__total">
            <span>Total</span>
            <strong>{formatINR(total)}</strong>
          </div>
        </section>
      </div>
    </div>
  )
}
