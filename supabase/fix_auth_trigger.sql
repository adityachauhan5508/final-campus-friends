-- ============================================================
-- FIX: "Database error saving new user"
-- Smart Campus Assistant – Supabase Auth Trigger Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Step 1: Drop the old broken trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create a fixed trigger function with correct search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(COALESCE(NEW.email, 'student@campus'), '@', 1)
    ),
    'student'::public.user_role   -- always student; staff roles are assigned manually
  )
  ON CONFLICT (id) DO NOTHING;   -- safe: won't overwrite existing profiles

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never block signup even if the profile insert fails
    RAISE NOTICE 'handle_new_user skipped: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 3: Re-attach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Fix INSERT policy on profiles so the trigger (service_role) can write
DROP POLICY IF EXISTS "Users and system can insert profile" ON public.profiles;
CREATE POLICY "Users and system can insert profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
    OR public.is_staff()
    OR current_role = 'service_role'
  );

-- Step 5: Verify trigger is attached (should return 1 row)
SELECT tgname, tgrelid::regclass, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
