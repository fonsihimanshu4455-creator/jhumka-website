// Vercel serverless function: create a Razorpay order.
// The secret key lives only here (server-side), never in the browser.
// Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay is not configured on the server.' })
  }

  const { amount } = req.body || {}
  const paise = Math.round(Number(amount) * 100)
  if (!paise || paise < 100) {
    return res.status(400).json({ error: 'Invalid amount.' })
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ amount: paise, currency: 'INR', payment_capture: 1 }),
    })
    const data = await r.json()
    if (!r.ok) {
      return res
        .status(502)
        .json({ error: data?.error?.description || 'Could not create payment order.' })
    }
    return res.status(200).json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    })
  } catch {
    return res.status(502).json({ error: 'Payment service unavailable. Try again.' })
  }
}
