import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    isViral: { type: Boolean, default: false },
    description: { type: String, default: '' },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
