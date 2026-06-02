import { useStore } from '../context/StoreContext.jsx'

export default function AnnouncementBar() {
  const { settings } = useStore()
  const messages = settings.announcements?.length
    ? settings.announcements
    : ['Welcome to our store']

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...messages, ...messages]
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
