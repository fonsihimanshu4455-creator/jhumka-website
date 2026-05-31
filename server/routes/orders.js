import { Router } from 'express'
import Order from '../models/Order.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/orders — public: customer places an order
router.post('/', async (req, res) => {
  try {
    const { items, customer, total } = req.body
    if (!items?.length) {
      return res.status(400).json({ message: 'Order has no items' })
    }
    const order = await Order.create({ items, customer, total })
    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// GET /api/orders — admin: list all orders
router.get('/', requireAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
})

// PATCH /api/orders/:id/status — admin: update order status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['Pending', 'Dispatched', 'Delivered', 'Cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router
