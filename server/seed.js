import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import Product from './models/Product.js'
import Admin from './models/Admin.js'

// Placeholder images — swap these out for real product photos later.
// Two images per product so the card hover-swap has something to show.
const img = (label, bg) =>
  'https://placehold.co/600x600/' + bg + '/6b2942?text=' + encodeURIComponent(label)

const PRODUCTS = [
  {
    name: 'Peacock Meenakari Jhumka',
    category: 'earrings',
    price: 449,
    mrp: 999,
    stock: 25,
    isViral: true,
    description:
      'Hand-painted meenakari jhumkas with delicate pearl drops. The viral festive favourite.',
    images: [img('Jhumka+1', 'ffd6e6'), img('Jhumka+2', 'f9bcd3')],
  },
  {
    name: 'Rose Gold Heart Pendant',
    category: 'necklaces',
    price: 599,
    mrp: 1299,
    stock: 18,
    isViral: true,
    description: 'Dainty rose-gold heart pendant on a fine chain. Everyday elegance.',
    images: [img('Pendant+1', 'ffe9f1'), img('Pendant+2', 'ffd6e6')],
  },
  {
    name: 'Minimalist Stackable Ring Set',
    category: 'rings',
    price: 349,
    mrp: 799,
    stock: 40,
    isViral: false,
    description: 'Set of 3 stackable rings in mixed finishes. Mix, match, sparkle.',
    images: [img('Rings+1', 'fff5f8'), img('Rings+2', 'ffe9f1')],
  },
  {
    name: 'Charm Beaded Bracelet',
    category: 'bracelets',
    price: 299,
    mrp: 699,
    stock: 32,
    isViral: true,
    description: 'Adjustable beaded bracelet with cute enamel charms.',
    images: [img('Bracelet+1', 'ffd6e6'), img('Bracelet+2', 'f9bcd3')],
  },
  {
    name: 'Butterfly Silver Anklet',
    category: 'anklets',
    price: 399,
    mrp: 899,
    stock: 21,
    isViral: false,
    description: 'Tinkling silver-tone anklet with tiny butterfly charms.',
    images: [img('Anklet+1', 'fff5f8'), img('Anklet+2', 'ffe9f1')],
  },
  {
    name: 'Bridal Gift Hamper Box',
    category: 'gift-sets',
    price: 1299,
    mrp: 2499,
    stock: 12,
    isViral: true,
    description: 'Curated gift box: earrings, bracelet & a pendant in a keepsake box.',
    images: [img('Gift+1', 'ffd6e6'), img('Gift+2', 'f9bcd3')],
  },
  {
    name: 'Pearl Drop Studs',
    category: 'earrings',
    price: 249,
    mrp: 599,
    stock: 50,
    isViral: false,
    description: 'Classic freshwater-look pearl drop studs for any occasion.',
    images: [img('Studs+1', 'ffe9f1'), img('Studs+2', 'ffd6e6')],
  },
  {
    name: 'Layered Coin Necklace',
    category: 'necklaces',
    price: 549,
    mrp: 1199,
    stock: 16,
    isViral: false,
    description: 'On-trend double-layered necklace with engraved coin charms.',
    images: [img('Necklace+1', 'fff5f8'), img('Necklace+2', 'ffe9f1')],
  },
  {
    name: 'Zircon Solitaire Ring',
    category: 'rings',
    price: 499,
    mrp: 1099,
    stock: 28,
    isViral: true,
    description: 'Sparkling AD zircon solitaire with a rhodium finish.',
    images: [img('Ring+1', 'ffd6e6'), img('Ring+2', 'f9bcd3')],
  },
  {
    name: 'Evil Eye Bracelet',
    category: 'bracelets',
    price: 279,
    mrp: 649,
    stock: 45,
    isViral: false,
    description: 'Protective evil-eye charm bracelet with a dainty chain.',
    images: [img('EvilEye+1', 'fff5f8'), img('EvilEye+2', 'ffe9f1')],
  },
  {
    name: 'Oxidised Ghungroo Anklet',
    category: 'anklets',
    price: 459,
    mrp: 999,
    stock: 19,
    isViral: false,
    description: 'Boho oxidised silver anklet with traditional ghungroo bells.',
    images: [img('Ghungroo+1', 'ffd6e6'), img('Ghungroo+2', 'f9bcd3')],
  },
  {
    name: 'Birthday Surprise Combo',
    category: 'gift-sets',
    price: 899,
    mrp: 1799,
    stock: 14,
    isViral: false,
    description: 'A cheerful combo of studs, ring & bracelet, ready to gift.',
    images: [img('Combo+1', 'ffe9f1'), img('Combo+2', 'ffd6e6')],
  },
]

async function seed() {
  await connectDB()

  // --- Products ---
  await Product.deleteMany({})
  await Product.insertMany(PRODUCTS)
  console.log(`✅ Seeded ${PRODUCTS.length} products`)

  // --- Default admin ---
  const email = (process.env.ADMIN_EMAIL || 'admin@jhumka.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  await Admin.deleteOne({ email })
  await Admin.create({ email, password }) // hashed by pre-save hook
  console.log(`✅ Admin ready → ${email} / ${password}`)

  await mongoose.disconnect()
  console.log('🌱 Seeding complete')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
