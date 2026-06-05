-- ============================================================================
-- Jhumka store — Supabase schema, security & demo data
-- ----------------------------------------------------------------------------
-- HOW TO USE:
--   1. Open your Supabase project → SQL Editor → New query
--   2. Paste this whole file and click "Run"
-- It is safe to run more than once.
-- ============================================================================

-- ---- Tables ----------------------------------------------------------------

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null,
  category    text    not null,
  price       integer not null default 0,
  mrp         integer not null default 0,
  images      jsonb   not null default '[]'::jsonb,
  stock       integer not null default 0,
  is_viral    boolean not null default false,
  description text    not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  image       text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.coupons (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  type         text not null default 'percent',  -- 'percent' | 'flat'
  value        integer not null default 0,
  min_order    integer not null default 0,
  max_discount integer not null default 0,
  active       boolean not null default true,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  items      jsonb not null default '[]'::jsonb,
  customer   jsonb not null default '{}'::jsonb,
  total      integer not null default 0,
  status     text not null default 'Pending',  -- Pending|Dispatched|Delivered|Cancelled
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key  text primary key default 'store',
  data jsonb not null default '{}'::jsonb
);

-- ---- Row Level Security ----------------------------------------------------
-- The browser uses the public "anon" key. RLS decides what anonymous visitors
-- vs. signed-in admins may do. Reads are public; writes require a logged-in
-- admin. Orders are the exception: anyone may place one.

alter table public.products   enable row level security;
alter table public.categories enable row level security;
alter table public.coupons    enable row level security;
alter table public.orders     enable row level security;
alter table public.settings   enable row level security;

-- Public can read catalogue + store config
drop policy if exists "public read products"   on public.products;
drop policy if exists "public read categories" on public.categories;
drop policy if exists "public read coupons"    on public.coupons;
drop policy if exists "public read settings"   on public.settings;
create policy "public read products"   on public.products   for select using (true);
create policy "public read categories" on public.categories for select using (true);
create policy "public read coupons"    on public.coupons    for select using (true);
create policy "public read settings"   on public.settings   for select using (true);

-- Signed-in admins can do everything on the catalogue + settings
drop policy if exists "admin write products"   on public.products;
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write coupons"    on public.coupons;
drop policy if exists "admin write settings"   on public.settings;
create policy "admin write products"   on public.products   for all to authenticated using (true) with check (true);
create policy "admin write categories" on public.categories for all to authenticated using (true) with check (true);
create policy "admin write coupons"    on public.coupons    for all to authenticated using (true) with check (true);
create policy "admin write settings"   on public.settings   for all to authenticated using (true) with check (true);

-- Orders: anyone may create; only admins may read / update
drop policy if exists "anyone create order" on public.orders;
drop policy if exists "admin read orders"   on public.orders;
drop policy if exists "admin update orders" on public.orders;
create policy "anyone create order" on public.orders for insert with check (true);
create policy "admin read orders"   on public.orders for select to authenticated using (true);
create policy "admin update orders" on public.orders for update to authenticated using (true) with check (true);

-- ---- Image storage ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images"  on storage.objects;
drop policy if exists "admin upload product images" on storage.objects;
drop policy if exists "admin update product images" on storage.objects;
drop policy if exists "admin delete product images" on storage.objects;
create policy "public read product images"  on storage.objects for select using (bucket_id = 'product-images');
create policy "admin upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "admin update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "admin delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');

-- ============================================================================
-- Demo content — so the store looks complete on day one.
-- Delete these rows (or edit from the admin panel) once you add real products.
-- ============================================================================

insert into public.categories (name, slug, image, sort_order) values
  ('Earrings',  'earrings',  'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=700&q=80&auto=format&fit=crop', 1),
  ('Necklaces', 'necklaces', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80&auto=format&fit=crop', 2),
  ('Rings',     'rings',     'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80&auto=format&fit=crop', 3),
  ('Bracelets', 'bracelets', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=80&auto=format&fit=crop', 4),
  ('Anklets',   'anklets',   'https://images.unsplash.com/photo-1620656798932-902cbb6e5e0f?w=700&q=80&auto=format&fit=crop', 5),
  ('Gift Sets', 'gift-sets', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=700&q=80&auto=format&fit=crop', 6)
on conflict (slug) do nothing;

insert into public.products (name, category, price, mrp, stock, is_viral, description, images) values
  ('Meenakari Pearl Drop Jhumka', 'earrings', 449, 999, 25, true,  'Hand-painted meenakari jhumkas finished with delicate pearl drops. A festive favourite.', '["https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=80&auto=format&fit=crop"]'),
  ('Rose Gold Heart Pendant',     'necklaces', 599, 1299, 18, true,  'A dainty rose-gold heart pendant on a fine chain — everyday elegance.', '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=80&auto=format&fit=crop"]'),
  ('Minimalist Stackable Ring Set','rings',    349, 799, 40, false, 'A set of three stackable rings in mixed finishes. Mix, match and layer.', '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=700&q=80&auto=format&fit=crop"]'),
  ('Charm Beaded Bracelet',       'bracelets', 299, 699, 32, true,  'An adjustable beaded bracelet with hand-set enamel charms.', '["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=700&q=80&auto=format&fit=crop"]'),
  ('Butterfly Silver Anklet',     'anklets',   399, 899, 21, false, 'A tinkling silver-tone anklet with tiny butterfly charms.', '["https://images.unsplash.com/photo-1620656798932-902cbb6e5e0f?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&q=80&auto=format&fit=crop"]'),
  ('Bridal Gift Hamper Box',      'gift-sets', 1299, 2499, 12, true, 'A curated keepsake box with earrings, a bracelet and a pendant — ready to gift.', '["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&q=80&auto=format&fit=crop"]'),
  ('Classic Pearl Stud Earrings', 'earrings',  249, 599, 50, false, 'Timeless freshwater-look pearl studs for any occasion.', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=700&q=80&auto=format&fit=crop"]'),
  ('Layered Coin Necklace',       'necklaces', 549, 1199, 16, false,'An on-trend double-layered necklace with engraved coin charms.', '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80&auto=format&fit=crop"]'),
  ('Zircon Solitaire Ring',       'rings',     499, 1099, 28, true,  'A sparkling AD zircon solitaire with a bright rhodium finish.', '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80&auto=format&fit=crop"]'),
  ('Evil Eye Chain Bracelet',     'bracelets', 279, 649, 45, false, 'A protective evil-eye charm on a dainty chain bracelet.', '["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=80&auto=format&fit=crop"]'),
  ('Oxidised Ghungroo Anklet',    'anklets',   459, 999, 19, false, 'A boho oxidised silver anklet with traditional ghungroo bells.', '["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1620656798932-902cbb6e5e0f?w=700&q=80&auto=format&fit=crop"]'),
  ('Birthday Surprise Combo',     'gift-sets', 899, 1799, 14, false,'A cheerful combo of studs, a ring and a bracelet — ready to gift.', '["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700&q=80&auto=format&fit=crop","https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=700&q=80&auto=format&fit=crop"]')
on conflict do nothing;

insert into public.settings (key, data) values (
  'store',
  '{
    "brandName": "Jhumka",
    "tagline": "Fine Jewellery & Gifts",
    "logo": "",
    "whatsapp": "",
    "announcements": [
      "Complimentary shipping on orders above ₹999",
      "New Festive Edit — now live",
      "Flat 10% off your first order · code WELCOME10",
      "Cash on delivery available across India"
    ],
    "heroTitle": "Everyday elegance, honest prices",
    "heroSubtitle": "Handcrafted · New Festive Edit",
    "heroImage": "",
    "offerText": "Use code WELCOME10 for 10% off your first order",
    "offerActive": true
  }'::jsonb
)
on conflict (key) do nothing;

insert into public.coupons (code, type, value, min_order, max_discount, active) values
  ('WELCOME10', 'percent', 10, 0, 300, true)
on conflict (code) do nothing;
