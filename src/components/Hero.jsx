import SmartImage from './SmartImage.jsx'
import { IconArrowRight, IconStar } from './icons.jsx'

const HERO_IMG =
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&q=80&auto=format&fit=crop'

const STATS = [
  { value: '50,000+', label: 'Happy customers' },
  { value: '4.8', label: 'Average rating', star: true },
  { value: '500+', label: 'Curated designs' },
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
          <span className="hero__eyebrow">Handcrafted · New Festive Edit</span>
          <h1 className="hero__title">
            Jewellery that tells <em>your</em> story
          </h1>
          <p className="hero__text">
            Timeless earrings, dainty necklaces and giftable sets — thoughtfully
            curated for everyday elegance. Premium craftsmanship, honest prices.
          </p>
          <div className="hero__cta">
            <button className="btn btn--primary" onClick={scrollToProducts}>
              Shop the collection <IconArrowRight width="18" height="18" />
            </button>
            <a className="btn btn--ghost" href="#viral">
              View bestsellers
            </a>
          </div>
          <div className="hero__stats">
            {STATS.map((s) => (
              <div className="hero__stat" key={s.label}>
                <strong>
                  {s.value}
                  {s.star && <IconStar className="hero__star" />}
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__media">
          <SmartImage src={HERO_IMG} alt="Featured jewellery" className="hero__img" />
          <div className="hero__badge">
            <span className="hero__badge-top">Bestseller</span>
            <span className="hero__badge-sub">Festive Edit ’26</span>
          </div>
        </div>
      </div>
    </section>
  )
}
