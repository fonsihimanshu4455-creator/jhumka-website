import SmartImage from './SmartImage.jsx'
import { IconArrowRight } from './icons.jsx'
import { useStore } from '../context/StoreContext.jsx'

const DEFAULT_HERO =
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1100&q=80&auto=format&fit=crop'

export default function Hero() {
  const { settings } = useStore()
  const scrollToShop = () =>
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero hero--compact">
      <SmartImage
        src={settings.heroImage || DEFAULT_HERO}
        alt=""
        className="hero__bg"
        aria-hidden="true"
      />
      <div className="hero__scrim" />
      <div className="container hero__content">
        {settings.heroSubtitle && (
          <span className="hero__eyebrow">{settings.heroSubtitle}</span>
        )}
        <h1 className="hero__title">{settings.heroTitle}</h1>
        <button className="btn btn--primary" onClick={scrollToShop}>
          Shop now <IconArrowRight width="18" height="18" />
        </button>
      </div>
    </section>
  )
}
