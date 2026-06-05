-- ============================================================================
-- Mobile (phone OTP) login  — run AFTER customer-auth.sql
-- ----------------------------------------------------------------------------
-- Updates the new-user trigger so that customers who sign up with their phone
-- get their number saved onto their profile too. Paste into Supabase → SQL
-- Editor → Run. Safe to run more than once.
--
-- IMPORTANT: OTP texts are only delivered once you enable an SMS provider:
--   Supabase → Authentication → Providers → Phone → enable + add a provider
--   (e.g. MSG91 / Twilio) with your credentials.
-- ============================================================================

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
