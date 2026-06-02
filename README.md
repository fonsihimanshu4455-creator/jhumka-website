# 💖 Jhumka — Jewellery & Gift Store

A full-stack e-commerce store for a trending jewellery & gift shop, with a
soft pastel-pink storefront and a separate admin panel.

- **Frontend:** Vite + React + React Router (plain CSS, Fraunces + Poppins)
- **Backend:** Node + Express + MongoDB (Mongoose), JWT auth, bcrypt, multer
- **Checkout:** WhatsApp-based ordering

---

## 📁 Project structure

```
jhumka-website/
├── index.html
├── package.json          # frontend
├── .env.example          # frontend env
├── src/
│   ├── api/              # axios client
│   ├── components/       # storefront UI (header, cards, cart drawer, …)
│   ├── context/          # cart + admin auth context
│   ├── layouts/          # storefront shell
│   ├── pages/            # Home, ProductDetail, Cart, NotFound
│   ├── admin/            # admin panel (login, dashboard, managers)
│   ├── constants.js
│   └── index.css         # all storefront + admin styles
└── server/
    ├── server.js         # Express entry
    ├── seed.js           # sample data + default admin
    ├── .env.example      # backend env
    ├── config/db.js
    ├── models/           # Product, Order, Admin
    ├── middleware/       # auth (JWT), upload (multer)
    ├── routes/           # products, orders, admin, upload
    └── uploads/          # uploaded images (served statically)
```

---

## 🚀 Getting started

You'll run **two** processes: the backend API and the frontend dev server.

### 1. Backend (`/server`)

```bash
cd server
npm install
cp .env.example .env        # then edit values
npm run seed                # loads 12 sample products + default admin
npm run dev                 # starts API on http://localhost:5000
```

Edit `server/.env`:

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | MongoDB Atlas / local connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Default admin created by the seed script |
| `CLIENT_ORIGIN` | Allowed CORS origin(s), comma-separated |
| `SERVER_URL` | Public URL of the API (for image links) |

> **MongoDB Atlas:** create a free cluster, add a database user, allow your IP
> (or `0.0.0.0/0` for dev), and paste the connection string into `MONGODB_URI`.

### 2. Frontend (project root)

```bash
npm install
cp .env.example .env        # then edit values
npm run dev                 # starts storefront on http://localhost:5173
```

Edit `.env`:

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL incl. `/api` (default `http://localhost:5000/api`) |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for checkout (digits only, e.g. `9199...`) |

---

## 🔑 Admin panel

Visit **`/admin/login`** and sign in with the seeded credentials
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`, default `admin@jhumka.com` / `admin123`).

- **Dashboard** — product / order counts + revenue summary
- **Products** — add / edit / delete, image upload, price · MRP · stock ·
  category, mark as **Viral**
- **Orders** — view customer details & update status
  (Pending → Dispatched → Delivered)

All admin write routes are protected by JWT middleware.

---

## 🛣️ REST API

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/products` | — | List products (`?category=`, `?viral=true`) |
| `GET` | `/api/products/:id` | — | Single product |
| `POST` | `/api/products` | ✅ | Create product |
| `PUT` | `/api/products/:id` | ✅ | Update product |
| `DELETE` | `/api/products/:id` | ✅ | Delete product |
| `POST` | `/api/orders` | — | Place an order |
| `GET` | `/api/orders` | ✅ | List orders |
| `PATCH` | `/api/orders/:id/status` | ✅ | Update order status |
| `POST` | `/api/admin/login` | — | Returns a JWT |
| `POST` | `/api/upload` | ✅ | Upload image, returns `{ url }` |
| `GET` | `/api/categories` | — | List categories |
| `POST` `PUT` `DELETE` | `/api/categories[/:id]` | ✅ | Manage categories |
| `POST` | `/api/coupons/apply` | — | Validate a code `{ code, subtotal }` → `{ discount }` |
| `GET` `POST` `PUT` `DELETE` | `/api/coupons[/:id]` | ✅ | Manage coupons |
| `GET` | `/api/settings` | — | Store branding / hero / offer / announcements |
| `PUT` | `/api/settings` | ✅ | Update store settings |

---

## 🛠️ Admin panel features

Sign in at **`/admin/login`**. The sidebar gives access to:

- **Dashboard** — product / order counts + revenue
- **Products** — add / edit / delete, images via URL · drag-drop · upload, price/MRP/stock/category, mark Bestseller
- **Categories** — add / edit / delete categories with photos (drive the header, category strip & filters)
- **Orders** — customer details + status (Pending → Dispatched → Delivered)
- **Coupons** — create % or flat codes with min-order, max-cap, expiry & active toggle (validated live at checkout)
- **Settings** — brand name, tagline, **logo upload**, WhatsApp number, hero title/subtitle/image, promo offer strip, and scrolling announcements

> The storefront reads categories & settings from the backend (with demo
> fallbacks), so branding, offers and coupons all update without code changes.

---

## 🎨 Storefront features

Scrolling announcement bar · sticky header with category nav + cart badge ·
compact image-led hero · optional promo offer strip · "Shop by category" strip ·
category-filtered product grid (shuffled) with filter chips · footer newsletter.
Product cards have two-image hover swap, sale % badge, strikethrough MRP and
quick add-to-bag. Slide-in cart drawer with quantity controls, **coupon codes**
and **WhatsApp checkout**. All branding, categories, offers and coupons are
admin-controlled. Fully mobile responsive.

---

## 🏗️ Production build

```bash
# Frontend
npm run build      # outputs to dist/
npm run preview    # preview the build locally

# Backend
cd server && npm start
```

The frontend `dist/` can be hosted on any static host (Netlify, Vercel,
Cloudflare Pages); point `VITE_API_URL` at your deployed API. The backend can
run on Render, Railway, Fly.io, etc. with the same `.env` variables.
