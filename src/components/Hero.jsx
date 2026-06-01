const STATS = [
  { value: '50k+', label: 'Happy customers' },
  { value: '4.8★', label: 'Average rating' },
  { value: '500+', label: 'Trending designs' },
]

export default function Hero() {
  const scrollToProducts = () =>
    document
      .getElementById('all-products')
      ?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__pill">✨ New Viral Drops Weekly</span>
          <h1 className="hero__title">
            Sparkle that <em>everyone</em> is talking about
          </h1>
          <p className="hero__text">
            Trending jhumkas, dainty necklaces &amp; giftable sets — curated for
            the moments that matter. Premium look, pocket-friendly prices.
          </p>
          <button className="btn btn--primary" onClick={scrollToProducts}>
            Shop the collection
          </button>
          <div className="hero__stats">
            {STATS.map((s) => (
              <div className="hero__stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__art">
          <div className="hero__blob" />
          <div className="hero__card hero__card--1">💍</div>
          <div className="hero__card hero__card--2">🌸</div>
          <div className="hero__card hero__card--3">✨</div>
        </div>
      </div>
    </section>
  )
}
