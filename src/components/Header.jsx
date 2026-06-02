import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { assetUrl } from '../api/client.js'
import { IconBag } from './icons.jsx'

export default function Header() {
  const { count, setIsOpen } = useCart()
  const { settings, categories } = useStore()
  const navigate = useNavigate()

  const goToCategory = (slug) => {
    navigate(slug ? `/?category=${slug}` : '/')
    setTimeout(() => {
      document
        .getElementById('shop')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="logo">
          {settings.logo ? (
            <img
              src={assetUrl(settings.logo)}
              alt={settings.brandName}
              className="logo__img"
            />
          ) : (
            <>
              <span className="logo__mark">{settings.brandName}</span>
              <span className="logo__sub">{settings.tagline}</span>
            </>
          )}
        </Link>

        <nav className="nav">
          <button className="nav__link" onClick={() => goToCategory('')}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className="nav__link"
              onClick={() => goToCategory(c.slug)}
            >
              {c.name}
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
