const MESSAGES = [
  'Complimentary shipping on orders above ₹999',
  'New Festive Edit — now live',
  'Flat 10% off your first order · code WELCOME10',
  'Cash on delivery available across India',
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
            <span className="announce__dot" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  )
}
