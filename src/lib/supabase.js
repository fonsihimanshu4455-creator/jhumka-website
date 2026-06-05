import { createClient } from '@supabase/supabase-js'

// Supabase project credentials come from Vite env vars. The anon key is safe to
// expose in the browser — row-level security (RLS) on the database controls what
// anonymous visitors vs. signed-in admins can actually do.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// When the project isn't configured yet, the storefront still runs on bundled
// demo data (the data layer simply reports "not configured" and callers fall
// back gracefully).
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

// Name of the public Storage bucket used for product / category / hero images.
export const IMAGE_BUCKET = 'product-images'
