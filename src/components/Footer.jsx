import { useState } from 'react'
import { CATEGORIES } from '../constants.js'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setDone(true)
    setEmail('')
  }

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="logo__mark">Jhumka</span>
          <p>
            Handpicked trending jewellery &amp; thoughtful gifts, delivered
            across India. Sparkle that fits every budget.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Pinterest">📌</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Shop</h4>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>{c.label}</li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Help</h4>
          <ul>
            <li>Track Order</li>
            <li>Shipping &amp; Returns</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>

        <div className="footer__news">
          <h4>Join the sparkle club</h4>
          <p>Subscribe for early access to drops &amp; secret discounts.</p>
          {done ? (
            <p className="footer__thanks">🎉 You're in! Check your inbox.</p>
          ) : (
            <form onSubmit={subscribe} className="footer__form">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </div>
      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} Jhumka. All rights reserved.</span>
        <span>Made with 💖 in India</span>
      </div>
    </footer>
  )
}
