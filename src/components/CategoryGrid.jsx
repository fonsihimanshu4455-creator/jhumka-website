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
      <div className="container section__head">
        <div>
          <h2 className="section__title">Shop by category</h2>
          <p className="section__sub">Find your next favourite</p>
        </div>
      </div>
      <div className="container cat-grid">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            className="cat-card"
            onClick={() => jump(c.slug)}
          >
            <span className="cat-card__emoji">{c.emoji}</span>
            <span className="cat-card__label">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
