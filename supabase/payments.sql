-- ============================================================================
-- Online payments (Razorpay)  — run AFTER schema.sql & customer-auth.sql
-- ----------------------------------------------------------------------------
-- Adds a place to store payment details on each order. Paste into Supabase →
-- SQL Editor → New query → Run. Safe to run more than once.
-- ============================================================================

alter table public.orders
  add column if not exists payment jsonb not null default '{}'::jsonb;

-- Orders now use these statuses:
--   Pending    → placed via WhatsApp (pay/confirm on WhatsApp)
--   Paid       → paid online with Razorpay
--   Dispatched / Delivered / Cancelled → as before
