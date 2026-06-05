// Vercel serverless function: verify a Razorpay payment signature.
// This proves the payment really succeeded (and wasn't faked) before we mark
// the order as paid. Uses the secret key, server-side only.

import crypto from 'crypto'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return res.status(500).json({ valid: false, error: 'Razorpay not configured.' })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {}
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ valid: false, error: 'Missing payment fields.' })
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const valid = expected === razorpay_signature
  return res.status(valid ? 200 : 400).json({ valid })
}
