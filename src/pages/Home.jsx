import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/client.js'
import Hero from '../components/Hero.jsx'
import CategoryGrid from '../components/CategoryGrid.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES } from '../constants.js'
import { DEMO_PRODUCTS } from '../data/demoProducts.js'

// Fisher–Yates shuffle — mixes products so the grid feels fresh each load.
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()

  const activeCat = params.get('category') || 'all'

  useEffect(() => {
    let active = true
    api
      .get('/products')
      .then(({ data }) => {
        if (!active) return
        // Use the backend's products; if none exist yet, show demo items so the
        // store never looks empty before the catalogue is set up.
        setProducts(data?.length ? data : DEMO_PRODUCTS)
      })
      .catch(() => {
        // No backend reachable — fall back to bundled demo products.
        if (active) setProducts(DEMO_PRODUCTS)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Shuffle once per product load; only reshuffles when the list changes.
  const shuffled = useMemo(() => shuffle(products), [products])

  const visible = useMemo(() => {
    if (activeCat === 'all') return shuffled
    return products.filter((p) => p.category === activeCat)
  }, [activeCat, shuffled, products])

  // Count per category, to hide empty filter chips.
  const counts = useMemo(() => {
    const c = {}
    for (const p of products) c[p.category] = (c[p.category] || 0) + 1
    return c
  }, [products])

  const selectCat = (slug) => {
    setParams(slug === 'all' ? {} : { category: slug })
    document
      .getElementById('shop')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeLabel =
    activeCat === 'all'
      ? 'All Products'
      : CATEGORIES.find((c) => c.slug === activeCat)?.label || 'Products'

  return (
    <>
      <Hero />

      {/* Shop by category — clicking filters the grid below */}
      <CategoryGrid active={activeCat} onSelect={selectCat} />

      {/* Products */}
      <section className="section section--tight" id="shop">
        <div className="container">
          {/* Filter chips */}
          <div className="chips">
            <button
              className={`chip ${activeCat === 'all' ? 'is-active' : ''}`}
              onClick={() => selectCat('all')}
            >
              All
            </button>
            {CATEGORIES.filter((c) => counts[c.slug]).map((c) => (
              <button
                key={c.slug}
                className={`chip ${activeCat === c.slug ? 'is-active' : ''}`}
                onClick={() => selectCat(c.slug)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="shop__head">
            <h2 className="shop__title">{activeLabel}</h2>
            {!loading && (
              <span className="shop__count">
                {visible.length} {visible.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>

          {loading && (
            <div className="grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="card card--skeleton" key={i}>
                  <div className="card__media skeleton" />
                  <div className="card__body">
                    <div className="skeleton skeleton--line" />
                    <div className="skeleton skeleton--line short" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && visible.length === 0 && (
            <p className="muted notice">No items in this category yet.</p>
          )}

          {!loading && visible.length > 0 && (
            <div className="grid">
              {visible.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
