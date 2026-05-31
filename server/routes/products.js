import { Router } from 'express'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/products — public list (optional ?category= & ?viral=true)
router.get('/', async (req, res) => {
  const filter = {}
  if (req.query.category) filter.category = req.query.category
  if (req.query.viral === 'true') filter.isViral = true
  const products = await Product.find(filter).sort({ createdAt: -1 })
  res.json(products)
})

// GET /api/products/:id — public single
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch {
    res.status(400).json({ message: 'Invalid product id' })
  }
})

// POST /api/products — admin create
router.post('/', requireAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/products/:id — admin update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/products/:id — admin delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product deleted' })
  } catch {
    res.status(400).json({ message: 'Invalid product id' })
  }
})

export default router
