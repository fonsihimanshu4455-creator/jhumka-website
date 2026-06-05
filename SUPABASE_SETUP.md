# Jhumka store — Supabase setup (no Render needed) 🚀

The website now talks **directly to Supabase**. There is no separate backend
server to deploy — just the frontend (on Vercel) + Supabase. Follow these steps
once and you're live.

Total time: ~10 minutes. You only copy-paste; no coding.

---

## 1. Create a Supabase project

1. Go to **https://supabase.com** → sign in with GitHub.
2. Click **New project**.
3. Fill in:
   - **Name:** `jhumka`
   - **Database password:** anything strong — save it somewhere.
   - **Region:** pick the closest one (e.g. **Mumbai** or **Singapore**).
4. Click **Create new project** and wait ~2 minutes for it to finish.

## 2. Create the tables + demo data (one paste)

1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open the file **`supabase/schema.sql`** from this repo, copy **everything**,
   paste it into the editor.
3. Click **Run**.

This creates all tables, security rules, the image storage bucket, and loads
demo products/categories so the store looks complete immediately. ✅

## 3. Create your admin login

1. Left sidebar → **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Enter the **email** and **password** you want to log into the admin panel
   with. Tick **Auto Confirm User** if it's shown.
3. Click **Create user**.

> This email + password is what you'll use at `/admin/login`.

## 3b. Turn on customer accounts + make yourself admin

The store supports **customer login/signup** (customers can track their orders,
and you see every customer + order in the admin panel). One more SQL file sets
this up and marks your account as the admin.

1. Open **`supabase/customer-auth.sql`** from this repo.
2. On the **last line**, change the email to the admin email you created in
   step 3:
   ```sql
   ... from auth.users where email = 'your-admin-email@example.com'
   ```
3. Copy the whole file → Supabase **SQL Editor** → **New query** → paste → **Run**.

Then make customer sign-up instant (no email click required):

4. **Authentication** → **Providers** (or **Sign In / Providers**) → **Email** →
   turn **OFF** "Confirm email" → Save.

> If you leave "Confirm email" ON, customers must click a link in their email
> before they can log in — signup still works, just with that extra step.

## 4. Copy your API keys

1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy these two values:
   - **Project URL** → looks like `https://abcdxyz.supabase.co`
   - **anon public** key (under *Project API keys*) → a long string.

The anon key is **safe to put in the website** — the database security rules
(set up in step 2) control what visitors vs. the admin can do.

## 5. Add the keys to Vercel

1. Open your project on **vercel.com** → **Settings** → **Environment
   Variables**.
2. Add these three:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | your Project URL (step 4) |
   | `VITE_SUPABASE_ANON_KEY` | your anon public key (step 4) |
   | `VITE_WHATSAPP_NUMBER` | your WhatsApp number, e.g. `919876543210` |

3. Go to **Deployments** → open the latest → **Redeploy** (so the new keys
   take effect).

## 6. Done — test it 🎉

- Open your website → you should see the products.
- Go to **`/admin/login`** → sign in with the email/password from step 3.
- Add/edit products, categories, coupons, upload images, see orders + customers.
- Click the **person icon** in the header → customers can **sign up / log in**
  and see their own orders under **My account**.
- On the storefront, add to cart → **Checkout on WhatsApp** sends the order to
  your number (and saves it, linked to the customer if they're logged in).

---

## Running locally (optional)

Create a file named **`.env`** in the project root with:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_NUMBER=919876543210
```

Then `npm install` and `npm run dev`.

> If the keys are missing, the site still runs and shows the bundled demo
> products — it just can't save anything until Supabase is connected.

---

## Notes

- The old `server/` folder (Express + MongoDB) is no longer used and can be
  ignored or deleted. No Render deployment is required.
- To remove the demo products, just delete them from the admin **Products**
  page once your real catalogue is in.
