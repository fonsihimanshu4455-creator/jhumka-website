import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    value: { type: Number, required: true, min: 0 }, // % or ₹
    minOrder: { type: Number, default: 0 }, // minimum cart subtotal
    maxDiscount: { type: Number, default: 0 }, // cap for percent (0 = no cap)
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
)

// Returns { ok, discount, message } for a given cart subtotal.
couponSchema.methods.evaluate = function evaluate(subtotal) {
  if (!this.active) return { ok: false, message: 'This coupon is inactive.' }
  if (this.expiresAt && this.expiresAt < new Date())
    return { ok: false, message: 'This coupon has expired.' }
  if (subtotal < this.minOrder)
    return {
      ok: false,
      message: `Minimum order of ₹${this.minOrder} required for this coupon.`,
    }

  let discount =
    this.type === 'percent' ? (subtotal * this.value) / 100 : this.value
  if (this.type === 'percent' && this.maxDiscount > 0)
    discount = Math.min(discount, this.maxDiscount)
  discount = Math.min(Math.round(discount), subtotal)

  return { ok: true, discount, message: 'Coupon applied.' }
}

export default mongoose.model('Coupon', couponSchema)
