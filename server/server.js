import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// ---- Middleware ----
const origins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: origins.length ? origins : true,
  }),
)
app.use(express.json({ limit: '1mb' }))

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ---- Routes ----
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)

// ---- Error handler (e.g. multer errors) ----
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(err.status || 400).json({ message: err.message })
})

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ Failed to start server:', err.message)
    process.exit(1)
  })
