import { useState } from 'react'
import { assetUrl } from '../api/client.js'
import { FALLBACK_IMG } from '../constants.js'

// An <img> that gracefully swaps to an elegant monogram fallback if the
// source is empty or fails to load — so cards never show a broken image.
export default function SmartImage({ src, alt = '', className, ...rest }) {
  const initial = assetUrl(src) || FALLBACK_IMG
  const [current, setCurrent] = useState(initial)

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (current !== FALLBACK_IMG) setCurrent(FALLBACK_IMG)
      }}
      {...rest}
    />
  )
}
