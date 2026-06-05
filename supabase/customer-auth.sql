-- ============================================================================
-- Customer accounts + roles  (run AFTER schema.sql)
-- ----------------------------------------------------------------------------
-- HOW TO USE:
--   1. Supabase → SQL Editor → New query
--   2. Paste this whole file
--   3. EDIT the email on the LAST line to your admin email, then click Run
-- Safe to run more than once.
-- ============================================================================

-- 1) One profile row per signed-up user --------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  phone      text not null default '',
  address    text not null default '',
  role       text not null default 'customer',   -- 'customer' | 'admin'
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- 2) Helper used by security rules to detect an admin -------------------------
-- SECURITY DEFINER so it can read profiles without tripping RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 3) Profile access rules -----------------------------------------------------
drop policy if exists "read own or admin profile" on public.profiles;
drop policy if exists "insert own profile"        on public.profiles;
drop policy if exists "update own profile"        on public.profiles;
create policy "read own or admin profile" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "insert own profile" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Stop a customer from making themselves an admin.
create or replace function public.protect_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null
     and new.role is distinct from old.role
     and not public.is_admin() then
    new.role := old.role;   -- silently keep the old role
  end if;
  return new;
end; $$;
drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- 4) Auto-create a profile the moment someone signs up ------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', new.phone, '')
  )
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Link each order to the customer who placed it ----------------------------
alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- 6) Only ADMINS may manage the catalogue (not every logged-in customer) ------
drop policy if exists "admin write products"   on public.products;
drop policy if exists "admin write categories" on public.categories;
drop policy if exists "admin write coupons"    on public.coupons;
drop policy if exists "admin write settings"   on public.settings;
create policy "admin write products"   on public.products   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write coupons"    on public.coupons    for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write settings"   on public.settings   for all using (public.is_admin()) with check (public.is_admin());

-- Orders: anyone can place one (guest or customer); customers see only their
-- own; admins see and manage all.
drop policy if exists "anyone create order"      on public.orders;
drop policy if exists "admin read orders"        on public.orders;
drop policy if exists "read own or admin orders" on public.orders;
drop policy if exists "admin update orders"      on public.orders;
create policy "anyone create order" on public.orders
  for insert with check (user_id is null or user_id = auth.uid());
create policy "read own or admin orders" on public.orders
  for select using (public.is_admin() or user_id = auth.uid());
create policy "admin update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- 7) Image uploads: admins only ----------------------------------------------
drop policy if exists "admin upload product images" on storage.objects;
drop policy if exists "admin update product images" on storage.objects;
drop policy if exists "admin delete product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "admin update product images" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin());
create policy "admin delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());

-- 8) MAKE YOUR ACCOUNT AN ADMIN ----------------------------------------------
-- 🔻 CHANGE the email below to the admin email you created in
--    Authentication → Users, then run. (Without this you can't open /admin.)
insert into public.profiles (id, role)
select id, 'admin' from auth.users where email = 'admin@jhumka.com'
on conflict (id) do update set role = 'admin';
