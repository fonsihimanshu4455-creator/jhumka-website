import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: { type: Number, default: 1 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], default: [] },
    customer: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
