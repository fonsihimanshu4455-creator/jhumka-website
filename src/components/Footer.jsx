import { useState } from 'react'
import { CATEGORIES } from '../constants.js'
import {
  IconInstagram,
  IconFacebook,
  IconPinterest,
  IconArrowRight,
} from './icons.jsx'

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
      <div className="container footer__news-band">
        <div>
          <h3>Join the inner circle</h3>
          <p>Early access to new drops, private sales &amp; styling notes.</p>
        </div>
        {done ? (
          <p className="footer__thanks">Thank you — check your inbox ✦</p>
        ) : (
          <form onSubmit={subscribe} className="footer__form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Subscribe">
              <IconArrowRight />
            </button>
          </form>
        )}
      </div>

      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="logo__mark">Jhumka</span>
          <p>
            Handcrafted jewellery &amp; thoughtful gifts, delivered across India.
            Elegance for every occasion.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram"><IconInstagram /></a>
            <a href="#" aria-label="Facebook"><IconFacebook /></a>
            <a href="#" aria-label="Pinterest"><IconPinterest /></a>
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

        <div className="footer__col">
          <h4>About</h4>
          <ul>
            <li>Our Story</li>
            <li>Care Guide</li>
            <li>Reviews</li>
            <li>Stores</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom container">
        <span>© {new Date().getFullYear()} Jhumka. All rights reserved.</span>
        <span>Crafted with care in India</span>
      </div>
    </footer>
  )
}
