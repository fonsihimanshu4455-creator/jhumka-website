import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { CATEGORIES } from '../constants.js'
import { IconBag } from './icons.jsx'

export default function Header() {
  const { count, setIsOpen } = useCart()
  const navigate = useNavigate()

  const goToCategory = (slug) => {
    navigate('/')
    // Wait for home render then scroll to the category section.
    setTimeout(() => {
      const el = document.getElementById(`cat-${slug}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else
        document
          .getElementById('all-products')
          ?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="logo">
          <span className="logo__mark">Jhumka</span>
          <span className="logo__sub">Fine Jewellery &amp; Gifts</span>
        </Link>

        <nav className="nav">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              className="nav__link"
              onClick={() => goToCategory(c.slug)}
            >
              {c.label}
            </button>
          ))}
        </nav>

        <button
          className="cart-btn"
          aria-label="Open cart"
          onClick={() => setIsOpen(true)}
        >
          <IconBag />
          {count > 0 && <span className="cart-btn__badge">{count}</span>}
        </button>
      </div>
    </header>
  )
}
