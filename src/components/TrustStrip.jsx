import { IconTruck, IconShield, IconGift, IconSparkle } from './icons.jsx'

const ITEMS = [
  { icon: IconTruck, title: 'Free shipping', sub: 'On orders above ₹999' },
  { icon: IconShield, title: '6-month warranty', sub: 'On all jewellery' },
  { icon: IconGift, title: 'Gift ready', sub: 'Premium packaging' },
  { icon: IconSparkle, title: 'Anti-tarnish', sub: 'Skin-friendly finish' },
]

export default function TrustStrip() {
  return (
    <section className="trust">
      <div className="container trust__grid">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div className="trust__item" key={title}>
            <span className="trust__icon">
              <Icon />
            </span>
            <div>
              <strong>{title}</strong>
              <span>{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
