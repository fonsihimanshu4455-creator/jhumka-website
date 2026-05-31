import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/upload — admin: upload one image, returns its public URL
router.post('/', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' })
  }
  // Served statically from /uploads (see server.js)
  const url = `/uploads/${req.file.filename}`
  res.status(201).json({ url })
})

export default router
