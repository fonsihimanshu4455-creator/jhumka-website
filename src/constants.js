// Shared storefront constants.

// WhatsApp number used for checkout (international format, no + or spaces).
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

export const CATEGORIES = [
  { slug: 'earrings', label: 'Earrings', emoji: '🌸' },
  { slug: 'necklaces', label: 'Necklaces', emoji: '✨' },
  { slug: 'rings', label: 'Rings', emoji: '💍' },
  { slug: 'bracelets', label: 'Bracelets', emoji: '🌷' },
  { slug: 'anklets', label: 'Anklets', emoji: '🦋' },
  { slug: 'gift-sets', label: 'Gift Sets', emoji: '🎁' },
]

export const formatINR = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN')

export const discountPct = (mrp, price) => {
  if (!mrp || mrp <= price) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}
