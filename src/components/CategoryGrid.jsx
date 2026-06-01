import SmartImage from './SmartImage.jsx'
import { CATEGORIES } from '../constants.js'

export default function CategoryGrid() {
  const jump = (slug) => {
    const el = document.getElementById(`cat-${slug}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else
      document
        .getElementById('all-products')
        ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section">
      <div className="container section__head section__head--center">
        <div>
          <span className="section__eyebrow">Browse</span>
          <h2 className="section__title">Shop by category</h2>
        </div>
      </div>
      <div className="container cat-grid">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            className="cat-card"
            onClick={() => jump(c.slug)}
          >
            <div className="cat-card__media">
              <SmartImage src={c.image} alt={c.label} className="cat-card__img" />
            </div>
            <span className="cat-card__label">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
