import { Router } from 'express'
import Coupon from '../models/Coupon.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/coupons/apply — public: validate a code against a cart subtotal
router.post('/apply', async (req, res) => {
  try {
    const { code, subtotal } = req.body
    if (!code) return res.status(400).json({ message: 'Enter a coupon code.' })

    const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim() })
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code.' })

    const result = coupon.evaluate(Number(subtotal) || 0)
    if (!result.ok) return res.status(400).json({ message: result.message })

    res.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: result.discount,
      message: result.message,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// GET /api/coupons — admin list
router.get('/', requireAuth, async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 })
  res.json(coupons)
})

// POST /api/coupons — admin create
router.post('/', requireAuth, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/coupons/:id — admin update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.json(coupon)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/coupons/:id — admin delete
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
    res.json({ message: 'Coupon deleted' })
  } catch {
    res.status(400).json({ message: 'Invalid coupon id' })
  }
})

export default router
