// Demo products bundled into the frontend so the storefront shows items even
// before a backend is connected. As soon as the API responds, REAL data from
// the backend is used instead — these are only a fallback.
//
// Replace freely later (or just connect the backend + run the seed script).

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=700&q=80&auto=format&fit=crop`

// Demo categories (used when no backend is connected).
export const DEMO_CATEGORIES = [
  { _id: 'c1', name: 'Earrings', slug: 'earrings', order: 1, image: u('1635767798638-3e25273a8236') },
  { _id: 'c2', name: 'Necklaces', slug: 'necklaces', order: 2, image: u('1599643478518-a784e5dc4c8f') },
  { _id: 'c3', name: 'Rings', slug: 'rings', order: 3, image: u('1605100804763-247f67b3557e') },
  { _id: 'c4', name: 'Bracelets', slug: 'bracelets', order: 4, image: u('1611652022419-a9419f74343d') },
  { _id: 'c5', name: 'Anklets', slug: 'anklets', order: 5, image: u('1620656798932-902cbb6e5e0f') },
  { _id: 'c6', name: 'Gift Sets', slug: 'gift-sets', order: 6, image: u('1513885535751-8b9238bd345a') },
]

// Demo store settings (branding / hero / announcements / offer).
export const DEMO_SETTINGS = {
  brandName: 'Jhumka',
  tagline: 'Fine Jewellery & Gifts',
  logo: '',
  whatsapp: '',
  announcements: [
    'Complimentary shipping on orders above ₹999',
    'New Festive Edit — now live',
    'Flat 10% off your first order · code WELCOME10',
    'Cash on delivery available across India',
  ],
  heroTitle: 'Everyday elegance, honest prices',
  heroSubtitle: 'Handcrafted · New Festive Edit',
  heroImage: '',
  offerText: 'Use code WELCOME10 for 10% off your first order',
  offerActive: true,
}

export const DEMO_PRODUCTS = [
  {
    _id: 'demo-1',
    name: 'Meenakari Pearl Drop Jhumka',
    category: 'earrings',
    price: 449,
    mrp: 999,
    stock: 25,
    isViral: true,
    description:
      'Hand-painted meenakari jhumkas finished with delicate pearl drops. A festive favourite.',
    images: [u('1635767798638-3e25273a8236'), u('1611652022419-a9419f74343d')],
  },
  {
    _id: 'demo-2',
    name: 'Rose Gold Heart Pendant',
    category: 'necklaces',
    price: 599,
    mrp: 1299,
    stock: 18,
    isViral: true,
    description: 'A dainty rose-gold heart pendant on a fine chain — everyday elegance.',
    images: [u('1599643478518-a784e5dc4c8f'), u('1611591437281-460bfbe1220a')],
  },
  {
    _id: 'demo-3',
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
    _id: 'demo-4',
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
    _id: 'demo-5',
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
    _id: 'demo-6',
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
    _id: 'demo-7',
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
    _id: 'demo-8',
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
    _id: 'demo-9',
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
    _id: 'demo-10',
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
    _id: 'demo-11',
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
    _id: 'demo-12',
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
