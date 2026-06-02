import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 }, // display order
  },
  { timestamps: true },
)

export default mongoose.model('Category', categorySchema)
