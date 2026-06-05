import { supabase, isSupabaseConfigured, IMAGE_BUCKET } from '../lib/supabase.js'

// ---------------------------------------------------------------------------
// Supabase-backed data layer.
//
// The rest of the app was written against a small REST backend and calls
// api.get('/products'), api.post('/orders', …) and so on. To avoid touching
// every component, this module keeps that exact axios-style interface but
// fulfils each call against Supabase (Postgres + Storage + Auth).
//
// Each method resolves to { data } on success and throws an axios-shaped error
// ({ response: { data: { message } } }) on failure, just like the old client.
// ---------------------------------------------------------------------------

function fail(message) {
  const err = new Error(message)
  err.response = { data: { message } }
  throw err
}

function guard() {
  if (!isSupabaseConfigured || !supabase) {
    fail('Store is not connected yet. Add your Supabase keys to go live.')
  }
}

const ok = (data) => ({ data })

// Numbers come back from PostgREST reliably for integer columns; coerce anyway.
const num = (v) => (v == null ? 0 : Number(v))

// Split "/products/123/status?x=1" -> ["products", "123", "status"]
const seg = (path) => path.replace(/^\/+/, '').split('?')[0].split('/').filter(Boolean)

// ---- Row mappers (DB snake_case  <->  app camelCase, _id alias) ----
const productFromDb = (r) => ({
  _id: r.id,
  name: r.name,
  category: r.category,
  price: num(r.price),
  mrp: num(r.mrp),
  images: r.images || [],
  stock: num(r.stock),
  isViral: !!r.is_viral,
  description: r.description || '',
  createdAt: r.created_at,
})
const productToDb = (b) => ({
  name: b.name,
  category: b.category,
  price: num(b.price),
  mrp: num(b.mrp),
  images: b.images || [],
  stock: num(b.stock),
  is_viral: !!b.isViral,
  description: b.description || '',
})

const categoryFromDb = (r) => ({
  _id: r.id,
  name: r.name,
  slug: r.slug,
  image: r.image || '',
  order: num(r.sort_order),
  createdAt: r.created_at,
})
const categoryToDb = (b) => ({
  name: b.name,
  slug: b.slug,
  image: b.image || '',
  sort_order: num(b.order),
})

const couponFromDb = (r) => ({
  _id: r.id,
  code: r.code,
  type: r.type,
  value: num(r.value),
  minOrder: num(r.min_order),
  maxDiscount: num(r.max_discount),
  active: !!r.active,
  expiresAt: r.expires_at,
  createdAt: r.created_at,
})
const couponToDb = (b) => ({
  code: (b.code || '').toUpperCase().trim(),
  type: b.type || 'percent',
  value: num(b.value),
  min_order: num(b.minOrder),
  max_discount: num(b.maxDiscount),
  active: b.active !== false,
  expires_at: b.expiresAt || null,
})

const orderFromDb = (r) => ({
  _id: r.id,
  items: r.items || [],
  customer: r.customer || {},
  total: num(r.total),
  status: r.status,
  userId: r.user_id || null,
  createdAt: r.created_at,
})

const profileFromDb = (r) => ({
  _id: r.id,
  fullName: r.full_name || '',
  phone: r.phone || '',
  address: r.address || '',
  role: r.role,
  createdAt: r.created_at,
})
const orderToDb = (b) => ({
  items: b.items || [],
  customer: b.customer || {},
  total: num(b.total),
  status: b.status || 'Pending',
})

// Mirror of the old backend's coupon.evaluate(), run client-side.
function evaluateCoupon(r, subtotal) {
  if (!r.active) fail('This coupon is inactive.')
  if (r.expires_at && new Date(r.expires_at) < new Date())
    fail('This coupon has expired.')
  if (subtotal < num(r.min_order))
    fail(`Minimum order of ₹${num(r.min_order)} required for this coupon.`)
  return {
    code: r.code,
    type: r.type,
    value: num(r.value),
    maxDiscount: num(r.max_discount) || 0,
  }
}

async function uploadImage(formData) {
  guard()
  const file = formData.get('image')
  if (!file) fail('No image provided.')
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase()
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(name, file, { cacheControl: '3600', upsert: false })
  if (error) fail(error.message)
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(name)
  return ok({ url: data.publicUrl })
}

// ---- HTTP-style verbs ----
async function get(path) {
  guard()
  const s = seg(path)
  switch (s[0]) {
    case 'products': {
      if (s[1]) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', s[1])
          .maybeSingle()
        if (error) fail(error.message)
        return ok(data ? productFromDb(data) : null)
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) fail(error.message)
      return ok((data || []).map(productFromDb))
    }
    case 'categories': {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) fail(error.message)
      return ok((data || []).map(categoryFromDb))
    }
    case 'coupons': {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) fail(error.message)
      return ok((data || []).map(couponFromDb))
    }
    case 'orders': {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) fail(error.message)
      return ok((data || []).map(orderFromDb))
    }
    case 'settings': {
      const { data, error } = await supabase
        .from('settings')
        .select('data')
        .eq('key', 'store')
        .maybeSingle()
      if (error) fail(error.message)
      return ok(data?.data || {})
    }
    case 'profile': {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return ok(null)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (error) fail(error.message)
      return ok(data ? profileFromDb(data) : null)
    }
    case 'customers': {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })
      if (error) fail(error.message)
      return ok((data || []).map(profileFromDb))
    }
    default:
      fail(`Unknown GET ${path}`)
  }
}

async function post(path, body) {
  const s = seg(path)

  if (s[0] === 'upload') return uploadImage(body)

  if (s[0] === 'admin' && s[1] === 'login') {
    guard()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })
    if (error) fail(error.message)
    return ok({ token: data.session?.access_token || '' })
  }

  guard()
  switch (s[0]) {
    case 'products': {
      const { data, error } = await supabase
        .from('products')
        .insert(productToDb(body))
        .select()
        .single()
      if (error) fail(error.message)
      return ok(productFromDb(data))
    }
    case 'categories': {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryToDb(body))
        .select()
        .single()
      if (error) fail(error.message)
      return ok(categoryFromDb(data))
    }
    case 'coupons': {
      if (s[1] === 'apply') {
        const code = (body.code || '').toUpperCase().trim()
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', code)
          .maybeSingle()
        if (error) fail(error.message)
        if (!data) fail('Invalid coupon code.')
        return ok(evaluateCoupon(data, num(body.subtotal)))
      }
      const { data, error } = await supabase
        .from('coupons')
        .insert(couponToDb(body))
        .select()
        .single()
      if (error) fail(error.message)
      return ok(couponFromDb(data))
    }
    case 'orders': {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('orders')
        .insert({ ...orderToDb(body), user_id: user?.id || null })
        .select()
        .single()
      if (error) fail(error.message)
      return ok(orderFromDb(data))
    }
    default:
      fail(`Unknown POST ${path}`)
  }
}

async function put(path, body) {
  guard()
  const s = seg(path)
  switch (s[0]) {
    case 'products': {
      const { data, error } = await supabase
        .from('products')
        .update(productToDb(body))
        .eq('id', s[1])
        .select()
        .single()
      if (error) fail(error.message)
      return ok(productFromDb(data))
    }
    case 'categories': {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryToDb(body))
        .eq('id', s[1])
        .select()
        .single()
      if (error) fail(error.message)
      return ok(categoryFromDb(data))
    }
    case 'coupons': {
      const { data, error } = await supabase
        .from('coupons')
        .update(couponToDb(body))
        .eq('id', s[1])
        .select()
        .single()
      if (error) fail(error.message)
      return ok(couponFromDb(data))
    }
    case 'settings': {
      // Persist the whole settings object under a single 'store' row.
      const clean = { ...body }
      delete clean._id
      delete clean.createdAt
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'store', data: clean }, { onConflict: 'key' })
      if (error) fail(error.message)
      return ok(clean)
    }
    case 'profile': {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) fail('You are not logged in.')
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: body.fullName || '',
          phone: body.phone || '',
          address: body.address || '',
        })
        .eq('id', user.id)
        .select()
        .single()
      if (error) fail(error.message)
      return ok(profileFromDb(data))
    }
    default:
      fail(`Unknown PUT ${path}`)
  }
}

async function patch(path, body) {
  guard()
  const s = seg(path)
  // /orders/:id/status
  if (s[0] === 'orders' && s[2] === 'status') {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: body.status })
      .eq('id', s[1])
      .select()
      .single()
    if (error) fail(error.message)
    return ok(orderFromDb(data))
  }
  fail(`Unknown PATCH ${path}`)
}

async function del(path) {
  guard()
  const s = seg(path)
  const tables = {
    products: 'products',
    categories: 'categories',
    coupons: 'coupons',
    orders: 'orders',
  }
  const table = tables[s[0]]
  if (!table || !s[1]) fail(`Unknown DELETE ${path}`)
  const { error } = await supabase.from(table).delete().eq('id', s[1])
  if (error) fail(error.message)
  return ok({})
}

// Images are stored as absolute URLs (Supabase Storage public URLs, pasted URLs
// or bundled demo URLs), so this is mostly a pass-through now.
export const assetUrl = (path) => path || ''

const api = { get, post, put, patch, delete: del }
export default api
