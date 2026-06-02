import { Router } from 'express'
import Category from '../models/Category.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/categories — public list, ordered
router.get('/', async (req, res) => {
  const cats = await Category.find().sort({ order: 1, createdAt: 1 })
  res.json(cats)
})

// POST /api/categories — admin create
router.post('/', requireAuth, async (req, res) => {
  try {
    const cat = await Category.create(req.body)
    res.status(201).json(cat)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/categories/:id — admin update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!cat) return res.status(404).json({ message: 'Category not found' })
    res.json(cat)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/categories/:id — admin delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id)
    if (!cat) return res.status(404).json({ message: 'Category not found' })
    res.json({ message: 'Category deleted' })
  } catch {
    res.status(400).json({ message: 'Invalid category id' })
  }
})

export default router
