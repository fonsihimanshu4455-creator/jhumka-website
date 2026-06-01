// Shared storefront constants.

// WhatsApp number used for checkout (international format, no + or spaces).
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

// Categories with a representative photo (used in the category strip).
// Replace these `image` URLs anytime — admin products use their own images.
export const CATEGORIES = [
  {
    slug: 'earrings',
    label: 'Earrings',
    image:
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&q=80&auto=format&fit=crop',
  },
  {
    slug: 'necklaces',
    label: 'Necklaces',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&auto=format&fit=crop',
  },
  {
    slug: 'rings',
    label: 'Rings',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format&fit=crop',
  },
  {
    slug: 'bracelets',
    label: 'Bracelets',
    image:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&auto=format&fit=crop',
  },
  {
    slug: 'anklets',
    label: 'Anklets',
    image:
      'https://images.unsplash.com/photo-1620656798932-902cbb6e5e0f?w=600&q=80&auto=format&fit=crop',
  },
  {
    slug: 'gift-sets',
    label: 'Gift Sets',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80&auto=format&fit=crop',
  },
]

export const formatINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')

export const discountPct = (mrp, price) => {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

// Elegant inline-SVG fallback shown when a product/category image is missing
// or fails to load. A soft cream tile with the Jhumka monogram — never a
// broken-image icon.
export const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f7efe9"/>
          <stop offset="1" stop-color="#efe2d8"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <circle cx="300" cy="300" r="120" fill="none" stroke="#caa37e" stroke-width="1.5" opacity="0.6"/>
      <text x="300" y="318" font-family="Georgia, serif" font-size="64" fill="#a9824f" text-anchor="middle" opacity="0.85">J</text>
    </svg>`.replace(/\s+/g, ' '),
  )
