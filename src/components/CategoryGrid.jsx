import SmartImage from './SmartImage.jsx'
import { useStore } from '../context/StoreContext.jsx'

export default function CategoryGrid({ active = 'all', onSelect }) {
  const { categories } = useStore()
  if (!categories.length) return null

  return (
    <section className="section section--tight">
      <div className="container section__head section__head--center">
        <div>
          <span className="section__eyebrow">Browse</span>
          <h2 className="section__title">Shop by category</h2>
        </div>
      </div>
      <div className="container cat-grid">
        {categories.map((c) => (
          <button
            key={c.slug}
            className={`cat-card ${active === c.slug ? 'is-active' : ''}`}
            onClick={() => onSelect?.(c.slug)}
          >
            <div className="cat-card__media">
              <SmartImage src={c.image} alt={c.name} className="cat-card__img" />
            </div>
            <span className="cat-card__label">{c.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
