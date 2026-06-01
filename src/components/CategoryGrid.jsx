import SmartImage from './SmartImage.jsx'
import { CATEGORIES } from '../constants.js'

export default function CategoryGrid({ active = 'all', onSelect }) {
  return (
    <section className="section section--tight">
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
            className={`cat-card ${active === c.slug ? 'is-active' : ''}`}
            onClick={() => onSelect?.(c.slug)}
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
