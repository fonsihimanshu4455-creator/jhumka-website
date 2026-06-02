import { Router } from 'express'
import Settings from '../models/Settings.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Always work with the single 'store' settings document.
async function getOrCreate() {
  let doc = await Settings.findOne({ key: 'store' })
  if (!doc) doc = await Settings.create({ key: 'store' })
  return doc
}

// GET /api/settings — public store branding/offer config
router.get('/', async (req, res) => {
  const doc = await getOrCreate()
  res.json(doc)
})

// PUT /api/settings — admin update branding/offers
router.put('/', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreate()
    const fields = [
      'brandName',
      'tagline',
      'logo',
      'whatsapp',
      'announcements',
      'heroTitle',
      'heroSubtitle',
      'heroImage',
      'offerText',
      'offerActive',
    ]
    for (const f of fields) {
      if (req.body[f] !== undefined) doc[f] = req.body[f]
    }
    await doc.save()
    res.json(doc)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
