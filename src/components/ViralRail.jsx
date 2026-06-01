import { useRef } from 'react'
import ProductCard from './ProductCard.jsx'
import { IconArrowLeft, IconArrowRight } from './icons.jsx'

export default function ViralRail({ products }) {
  const trackRef = useRef(null)
  if (!products?.length) return null

  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="section viral" id="viral">
      <div className="container section__head">
        <div>
          <span className="section__eyebrow">Trending now</span>
          <h2 className="section__title">Bestsellers</h2>
        </div>
        <div className="rail__nav">
          <button onClick={() => scroll(-1)} aria-label="Scroll left">
            <IconArrowLeft />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right">
            <IconArrowRight />
          </button>
        </div>
      </div>
      <div className="rail" ref={trackRef}>
        <div className="rail__track">
          {products.map((p) => (
            <div className="rail__item" key={p._id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
