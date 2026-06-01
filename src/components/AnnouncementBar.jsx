const MESSAGES = [
  '🎀 FREE shipping on orders above ₹499',
  '✨ New Viral Collection just dropped',
  '💝 Flat 10% OFF — use code JHUMKA10',
  '🚚 COD available across India',
]

export default function AnnouncementBar() {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...MESSAGES, ...MESSAGES]
  return (
    <div className="announce">
      <div className="announce__track">
        {loop.map((m, i) => (
          <span className="announce__item" key={i}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
