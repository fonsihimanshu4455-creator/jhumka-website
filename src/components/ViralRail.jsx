import ProductCard from './ProductCard.jsx'

export default function ViralRail({ products }) {
  if (!products?.length) return null
  return (
    <section className="section viral">
      <div className="container section__head">
        <div>
          <h2 className="section__title">🔥 Viral Collection</h2>
          <p className="section__sub">The pieces blowing up your feed</p>
        </div>
      </div>
      <div className="rail">
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
