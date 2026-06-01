import { useEffect, useMemo, useState } from 'react'
import api from '../api/client.js'
import Hero from '../components/Hero.jsx'
import TrustStrip from '../components/TrustStrip.jsx'
import ViralRail from '../components/ViralRail.jsx'
import CategoryGrid from '../components/CategoryGrid.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES } from '../constants.js'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api
      .get('/products')
      .then(({ data }) => {
        if (active) setProducts(data)
      })
      .catch(() => active && setError('Could not load products.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const viral = useMemo(() => products.filter((p) => p.isViral), [products])

  const byCategory = useMemo(() => {
    const map = {}
    for (const c of CATEGORIES) map[c.slug] = []
    for (const p of products) {
      if (map[p.category]) map[p.category].push(p)
    }
    return map
  }, [products])

  return (
    <>
      <Hero />
      <TrustStrip />
      <ViralRail products={viral} />
      <CategoryGrid />

      <section className="section" id="all-products">
        <div className="container section__head section__head--center">
          <div>
            <span className="section__eyebrow">The collection</span>
            <h2 className="section__title">All Products</h2>
          </div>
        </div>

        <div className="container">
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
          {error && <p className="muted notice">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="muted notice">
              No products yet. Add some from the admin panel.
            </p>
          )}

          {/* Grouped by category so the header nav can scroll to anchors. */}
          {!loading &&
            CATEGORIES.map((c) =>
              byCategory[c.slug]?.length ? (
                <div key={c.slug} id={`cat-${c.slug}`} className="cat-section">
                  <h3 className="cat-section__title">{c.label}</h3>
                  <div className="grid">
                    {byCategory[c.slug].map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              ) : null,
            )}
        </div>
      </section>
    </>
  )
}
