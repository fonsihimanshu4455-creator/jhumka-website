import SmartImage from './SmartImage.jsx'
import { IconArrowRight } from './icons.jsx'

const HERO_IMG =
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1100&q=80&auto=format&fit=crop'

export default function Hero() {
  const scrollToShop = () =>
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero hero--compact">
      <SmartImage src={HERO_IMG} alt="" className="hero__bg" aria-hidden="true" />
      <div className="hero__scrim" />
      <div className="container hero__content">
        <span className="hero__eyebrow">Handcrafted · New Festive Edit</span>
        <h1 className="hero__title">Everyday elegance, honest prices</h1>
        <button className="btn btn--primary" onClick={scrollToShop}>
          Shop now <IconArrowRight width="18" height="18" />
        </button>
      </div>
    </section>
  )
}
