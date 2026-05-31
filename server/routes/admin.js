import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const router = Router()

// POST /api/admin/login — returns a JWT on success
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const ok = await admin.comparePassword(password)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    )

    res.json({ token, admin: { email: admin.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
