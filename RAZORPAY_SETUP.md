# Online payments with Razorpay 💳

The checkout page can take real payments (UPI, cards, netbanking) through
Razorpay. Payments are created and verified by secure serverless functions in
`/api/razorpay/` — your Razorpay **secret** never touches the browser.

You only need to add 2 keys to Vercel.

---

## 1. Get your Razorpay API keys

1. Log in at **https://dashboard.razorpay.com**.
2. Go to **Settings → API Keys** (under Account & Settings).
3. Click **Generate Key** (or use existing). You get:
   - **Key Id** — looks like `rzp_live_XXXXXXXX` (or `rzp_test_XXXXXXXX` in test mode)
   - **Key Secret** — shown once, copy it now.

> Use **test** keys (`rzp_test_…`) while trying it out, then switch to **live**
> keys once your KYC is approved and you're ready for real money.

## 2. Add them to Vercel

Vercel → your project → **Settings → Environment Variables** → add:

| Name | Value |
|------|-------|
| `RAZORPAY_KEY_ID` | your Key Id (`rzp_live_…` / `rzp_test_…`) |
| `RAZORPAY_KEY_SECRET` | your Key Secret |

> ⚠️ Do **NOT** prefix these with `VITE_`. They must stay server-side so the
> secret is never exposed in the browser.

Then **Deployments → Redeploy** so the functions pick up the keys.

## 3. Done — test it

1. Add a product to the cart → **Proceed to checkout**.
2. Fill name + phone → **Pay … online**.
3. The Razorpay window opens. With **test** keys you can use Razorpay's test
   UPI/cards (see Razorpay docs). With **live** keys it's real money.
4. After a successful payment the order is saved with status **Paid** and shows
   up in the admin **Orders** page.

---

## Notes

- Customers can still choose **Order on WhatsApp** instead of paying online.
- The payment id is stored on the order, and you can always cross-check it in
  your Razorpay dashboard.
- If the keys aren't set, the "Pay online" button shows a friendly error and
  WhatsApp ordering keeps working.
- Don't forget to run **`supabase/payments.sql`** once in the Supabase SQL
  Editor (adds the column that stores payment details).
