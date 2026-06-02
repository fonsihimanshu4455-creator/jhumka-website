import mongoose from 'mongoose'

// A single settings document holds store-wide branding & offer config.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'store', unique: true },
    brandName: { type: String, default: 'Jhumka' },
    tagline: { type: String, default: 'Fine Jewellery & Gifts' },
    logo: { type: String, default: '' }, // image URL (empty = text logo)
    whatsapp: { type: String, default: '' }, // checkout number
    // Scrolling announcement messages
    announcements: {
      type: [String],
      default: [
        'Complimentary shipping on orders above ₹999',
        'New Festive Edit — now live',
      ],
    },
    // Hero / promo banner
    heroTitle: { type: String, default: 'Everyday elegance, honest prices' },
    heroSubtitle: { type: String, default: 'Handcrafted · New Festive Edit' },
    heroImage: { type: String, default: '' },
    // Promo offer strip shown above the product grid (optional)
    offerText: { type: String, default: '' },
    offerActive: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('Settings', settingsSchema)
