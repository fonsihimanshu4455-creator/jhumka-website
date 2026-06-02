import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import Product from './models/Product.js'
import Admin from './models/Admin.js'
import Category from './models/Category.js'
import Coupon from './models/Coupon.js'
import Settings from './models/Settings.js'

// Real jewellery photos (Unsplash). Swap these any time from the admin panel
// via URL paste, drag-and-drop, or file upload. Two images per product so the
// product card's hover-swap has a second angle to show.
const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=700&q=80&auto=format&fit=crop`

const PRODUCTS = [
  {
    name: 'Meenakari Pearl Drop Jhumka',
    category: 'earrings',
    price: 449,
    mrp: 999,
    stock: 25,
    isViral: true,
    description:
      'Hand-painted meenakari jhumkas finished with delicate freshwater-look pearl drops. A festive favourite.',
    images: [u('1635767798638-3e25273a8236'), u('1611652022419-a9419f74343d')],
  },
  {
    name: 'Rose Gold Heart Pendant',
    category: 'necklaces',
    price: 599,
    mrp: 1299,
    stock: 18,
    isViral: true,
    description:
      'A dainty rose-gold heart pendant on a fine chain — understated everyday elegance.',
    images: [u('1599643478518-a784e5dc4c8f'), u('1611591437281-460bfbe1220a')],
  },
  {
    name: 'Minimalist Stackable Ring Set',
    category: 'rings',
    price: 349,
    mrp: 799,
    stock: 40,
    isViral: false,
    description: 'A set of three stackable rings in mixed finishes. Mix, match and layer.',
    images: [u('1605100804763-247f67b3557e'), u('1603561591411-07134e71a2a9')],
  },
  {
    name: 'Charm Beaded Bracelet',
    category: 'bracelets',
    price: 299,
    mrp: 699,
    stock: 32,
    isViral: true,
    description: 'An adjustable beaded bracelet with hand-set enamel charms.',
    images: [u('1611652022419-a9419f74343d'), u('1573408301185-9146fe634ad0')],
  },
  {
    name: 'Butterfly Silver Anklet',
    category: 'anklets',
    price: 399,
    mrp: 899,
    stock: 21,
    isViral: false,
    description: 'A tinkling silver-tone anklet with tiny butterfly charms.',
    images: [u('1620656798932-902cbb6e5e0f'), u('1602173574767-37ac01994b2a')],
  },
  {
    name: 'Bridal Gift Hamper Box',
    category: 'gift-sets',
    price: 1299,
    mrp: 2499,
    stock: 12,
    isViral: true,
    description:
      'A curated keepsake box with earrings, a bracelet and a pendant — ready to gift.',
    images: [u('1513885535751-8b9238bd345a'), u('1549465220-1a8b9238cd48')],
  },
  {
    name: 'Classic Pearl Stud Earrings',
    category: 'earrings',
    price: 249,
    mrp: 599,
    stock: 50,
    isViral: false,
    description: 'Timeless freshwater-look pearl studs for any occasion.',
    images: [u('1535632066927-ab7c9ab60908'), u('1535556116002-6281ff3e9f36')],
  },
  {
    name: 'Layered Coin Necklace',
    category: 'necklaces',
    price: 549,
    mrp: 1199,
    stock: 16,
    isViral: false,
    description: 'An on-trend double-layered necklace with engraved coin charms.',
    images: [u('1611591437281-460bfbe1220a'), u('1599643478518-a784e5dc4c8f')],
  },
  {
    name: 'Zircon Solitaire Ring',
    category: 'rings',
    price: 499,
    mrp: 1099,
    stock: 28,
    isViral: true,
    description: 'A sparkling AD zircon solitaire with a bright rhodium finish.',
    images: [u('1603561591411-07134e71a2a9'), u('1605100804763-247f67b3557e')],
  },
  {
    name: 'Evil Eye Chain Bracelet',
    category: 'bracelets',
    price: 279,
    mrp: 649,
    stock: 45,
    isViral: false,
    description: 'A protective evil-eye charm on a dainty chain bracelet.',
    images: [u('1573408301185-9146fe634ad0'), u('1611652022419-a9419f74343d')],
  },
  {
    name: 'Oxidised Ghungroo Anklet',
    category: 'anklets',
    price: 459,
    mrp: 999,
    stock: 19,
    isViral: false,
    description: 'A boho oxidised silver anklet with traditional ghungroo bells.',
    images: [u('1602173574767-37ac01994b2a'), u('1620656798932-902cbb6e5e0f')],
  },
  {
    name: 'Birthday Surprise Combo',
    category: 'gift-sets',
    price: 899,
    mrp: 1799,
    stock: 14,
    isViral: false,
    description: 'A cheerful combo of studs, a ring and a bracelet — ready to gift.',
    images: [u('1549465220-1a8b9238cd48'), u('1513885535751-8b9238bd345a')],
  },
]

async function seed() {
  await connectDB()

  // --- Products ---
  await Product.deleteMany({})
  await Product.insertMany(PRODUCTS)
  console.log(`✅ Seeded ${PRODUCTS.length} products`)

  // --- Categories ---
  const CATEGORIES = [
    { name: 'Earrings', slug: 'earrings', order: 1, image: u('1635767798638-3e25273a8236') },
    { name: 'Necklaces', slug: 'necklaces', order: 2, image: u('1599643478518-a784e5dc4c8f') },
    { name: 'Rings', slug: 'rings', order: 3, image: u('1605100804763-247f67b3557e') },
    { name: 'Bracelets', slug: 'bracelets', order: 4, image: u('1611652022419-a9419f74343d') },
    { name: 'Anklets', slug: 'anklets', order: 5, image: u('1620656798932-902cbb6e5e0f') },
    { name: 'Gift Sets', slug: 'gift-sets', order: 6, image: u('1513885535751-8b9238bd345a') },
  ]
  await Category.deleteMany({})
  await Category.insertMany(CATEGORIES)
  console.log(`✅ Seeded ${CATEGORIES.length} categories`)

  // --- Coupons ---
  await Coupon.deleteMany({})
  await Coupon.insertMany([
    { code: 'WELCOME10', type: 'percent', value: 10, minOrder: 0, maxDiscount: 200, active: true },
    { code: 'FESTIVE15', type: 'percent', value: 15, minOrder: 999, maxDiscount: 500, active: true },
    { code: 'FLAT100', type: 'flat', value: 100, minOrder: 499, active: true },
  ])
  console.log('✅ Seeded 3 coupons (WELCOME10, FESTIVE15, FLAT100)')

  // --- Store settings ---
  await Settings.deleteOne({ key: 'store' })
  await Settings.create({
    key: 'store',
    brandName: 'Jhumka',
    tagline: 'Fine Jewellery & Gifts',
    whatsapp: process.env.SEED_WHATSAPP || '919999999999',
    announcements: [
      'Complimentary shipping on orders above ₹999',
      'New Festive Edit — now live',
      'Flat 10% off your first order · code WELCOME10',
    ],
    heroTitle: 'Everyday elegance, honest prices',
    heroSubtitle: 'Handcrafted · New Festive Edit',
    offerText: 'Use code WELCOME10 for 10% off your first order',
    offerActive: true,
  })
  console.log('✅ Seeded store settings')

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
